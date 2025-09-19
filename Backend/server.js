import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/DB/db.js";
import authRoute from "./src/routes/auth.route.js";
import createBlog from "./src/routes/createBlog.route.js";
import blogs from "./src/routes/blogs.route.js";
import uploadImgRoute from "./src/routes/uploadImg.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userModel from "./src/models/user.model.js";
import verifyUser from "./src/middleware/verifyUser.middleware.js";
import commentModel from "./src/models/comment.model.js";
import blogModel from "./src/models/blog.model.js";
import NotificationModel from "./src/models/notification.model.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/uploadBanner", uploadImgRoute);
app.use("/create-blog", createBlog);
app.use("/blogs", blogs);
app.post("/search-user", (req, res) => {
  let { query } = req.body;

  userModel
    .find({
      "personal_info.username": new RegExp(query, "i"),
    })
    .limit(50)
    .select(
      "personal_info.fullname personal_info.username personal_info.profile_img -_id"
    )
    .then((user) => {
      return res.status(200).json({ user });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});
app.post("/get-profile", async (req, res) => {
  try {
    const { username } = req.body;

    const user = await userModel
      .findOne({
        "personal_info.username": username,
      })
      .select("-personal_info.password -google_auth -updatedAt -blogs");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});
app.post("/add-comment", verifyUser, (req, res) => {
  let user_id = req.user;
  let { _id, comment, blog_author } = req.body;

  if (!comment.length) {
    return res
      .status(403)
      .json({ error: "write something to leave a comment" });
  }

  commentModel
    .create({
      blog_id: _id,
      blog_author,
      comment,
      commented_by: user_id,
    })
    .then((commentFile) => {
      let { comment, commentedAt, children } = commentFile;
      blogModel
        .findOneAndUpdate(
          { _id },
          {
            $push: { comment: commentFile._id },
            $inc: {
              "activity.total_comments": 1,
              "activity.total_parent_comments": 1,
            },
          }
        )
        .then((blog) => {
          console.log("New comment created");
        });

      NotificationModel.create({
        type: "comment",
        blog: _id,
        notification_for: blog_author,
        user: user_id,
        comment: commentFile._id,
      }).then((notification) => console.log("new notification created"));

      return res.status(200).json({
        comment,
        commentedAt,
        _id: commentFile._id,
        user_id,
        children,
      });
    });
});
app.post("/get-blog-comment", (req, res) => {
  let { blog_id, skip } = req.body;
  console.log(skip);
  let maxLimit = 5;

  commentModel
    .find({ blog_id, isReply: false })
    .populate(
      "commented_by",
      "personal_info.username personal_info.fullname personal_info.profile_img"
    )
    .skip(skip)
    .limit(maxLimit)
    .sort({ commentedAt: -1 })
    .then((comment) => {
      return res.status(200).json(comment);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
});
// connect to DB
connectDB();
// start server
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
