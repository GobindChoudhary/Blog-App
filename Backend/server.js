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
import bcrypt from "bcrypt";
// regex for password
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

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
  let { _id, comment, blog_author, replying_to, notification_id } = req.body;

  if (!comment.length) {
    return res
      .status(403)
      .json({ error: "write something to leave a comment" });
  }

  let commentObj = {
    blog_id: _id,
    blog_author,
    comment,
    commented_by: user_id,
    replying_to,
  };

  if (replying_to) {
    commentObj.parent = replying_to;
    commentObj.isReply = true;
  }
  commentModel.create(commentObj).then(async (commentFile) => {
    let { comment, commentedAt, children } = commentFile;
    await blogModel
      .findOneAndUpdate(
        { _id },
        {
          $push: { comments: commentFile._id },
          $inc: {
            "activity.total_comments": 1,
            "activity.total_parent_comments": replying_to ? 0 : 1,
          },
        }
      )
      .then((blog) => {
        console.log("New comment created");
      });

    let notificationObj = {
      type: replying_to ? "reply" : "comment",
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: commentFile._id,
    };
    if (replying_to) {
      notificationObj.replied_on_comment = replying_to;
      await commentModel
        .findOneAndUpdate(
          { _id: replying_to },
          { $push: { children: commentFile._id } }
        )
        .then((replyToCommentDoc) => {
          if (replyToCommentDoc) {
            notificationObj.notification_for = replyToCommentDoc.commented_by;
          }
        });

      if (notification_id) {
        NotificationModel.findOneAndUpdate(
          { _id: notification_id },
          {
            reply: commentFile._id,
          }
        ).then((notification) => {
          console.log(notification);
        });
      }
    }

    NotificationModel.create(notificationObj).then((notification) =>
      console.log("new notification created")
    );

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

app.post("/get-replies", (req, res) => {
  let { _id, skip } = req.body;

  let maxLimit = 5;

  commentModel
    .findOne({ _id })
    .populate({
      path: "children",
      options: {
        limit: maxLimit,
        skip: skip,
        sort: {
          commentedAt: -1,
        },
      },
      populate: {
        path: "commented_by",
        select:
          "personal_info.profile_img personal_info.fullname personal_info.username",
      },
      select: "-blog_id -updatedAt",
    })
    .select("children")
    .then((doc) => {
      return res.status(200).json({
        replies: doc.children,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

const deleteComments = async (_id) => {
  try {
    const comment = await commentModel.findOneAndDelete({ _id });
    if (!comment) return;

    // Remove from parent if exists
    if (comment.parent) {
      await commentModel.findOneAndUpdate(
        { _id: comment.parent },
        { $pull: { children: _id } }
      );
      console.log("comment deleted from parent");
    }

    // Delete notifications
    await NotificationModel.findOneAndDelete({ comment: _id });
    await NotificationModel.findOneAndUpdate(
      { reply: _id },
      { $unset: { reply: 1 } }
    );

    // Update blog activity
    await blogModel.findOneAndUpdate(
      { _id: comment.blog_id },
      {
        $pull: { comments: _id },
        $inc: {
          "activity.total_comments": -1,
          "activity.total_parent_comments": comment.parent ? 0 : -1,
        },
      }
    );

    // Recursively delete replies
    if (comment.children.length) {
      for (let replyId of comment.children) {
        await deleteComments(replyId);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

app.post("/delete-comment", verifyUser, (req, res) => {
  let user_id = req.user;

  let { _id } = req.body;
  commentModel.findOne({ _id }).then((comment) => {
    if (user_id == comment.commented_by || user_id == comment.blog_author) {
      deleteComments(_id);

      return res.status(200).json({ status: "done" });
    } else {
      return res.status(403).json({
        error: "You can not delete this comment",
      });
    }
  });
});
app.post("/change-password", verifyUser, (req, res) => {
  let { currentPassword, newPassword } = req.body;

  if (
    !passwordRegex.test(currentPassword) ||
    !passwordRegex.test(newPassword)
  ) {
    return res.status(403).json({
      error:
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
    });
  }

  userModel
    .findById({ _id: req.user })
    .then((user) => {
      if (user.google_auth) {
        res.status(403).json({
          error:
            "You can't change account's password because you looged in through google",
        });
      }

      bcrypt.compare(
        currentPassword,
        user.personal_info.password,
        (err, result) => {
          if (err) {
            return res.status(500).json({
              error:
                "Some error occourd while changing the password, please try again later",
            });
          }

          if (!result) {
            return res.status(403).json({
              error: "Incorrect current password",
            });
          }

          bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            userModel
              .findOneAndUpdate(
                { _id: req.user },
                { "personal_info.password": hashedPassword }
              )
              .then((u) => {
                return res
                  .status(200)
                  .json({ status: "Password changed successfully" });
              })
              .catch((err) => {
                return res.status(500).json({
                  error:
                    "Some error occured while saving new password, please try again later",
                });
              });
          });
        }
      );
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({
        error: "User not found",
      });
    });
});

app.post("/update-profile-img", verifyUser, (req, res) => {
  let { url } = req.body;

  userModel
    .findOneAndUpdate({ _id: req.user }, { "personal_info.profile_img": url })
    .then(() => {
      return res.status(200).json({ profile_img: url });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

app.post("/update-profile", verifyUser, (req, res) => {
  let { username, bio, social_links } = req.body;

  let bioLimit = 150;

  if (username.length < 3) {
    return res
      .status(403)
      .json({ error: "Username should be atleast 3 letter long" });
  }
  if (bio.length > bioLimit) {
    return res
      .status(403)
      .json({ error: `Bio should not be more than ${bioLimit}` });
  }

  let socialLinksArr = Object.keys(social_links);

  try {
    for (let i = 0; i < socialLinksArr.length; i++) {
      if (social_links[socialLinksArr[i]].length) {
        let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

        if (
          !hostname.includes(`${socialLinksArr[i]}.com`) &&
          socialLinksArr[i] != "website"
        ) {
          return res.status(403).json({
            error: `${socialLinksArr[i]} link is invalid. you must enter a full link`,
          });
        }
      }
    }
  } catch {
    return res.status(500).json({
      error: "You must provide full social links with http(s) included",
    });
  }

  let updateObj = {
    "personal_info.username": username,
    "personal_info.bio": bio,
    social_links,
  };

  userModel
    .findOneAndUpdate({ _id: req.user }, updateObj, {
      runValidators: true,
    })
    .then(() => {
      res.status(200).json({ username });
    })
    .catch((err) => {
      if (err.code == 11000) {
        return res.status(409).json({ error: "username is already taken" });
      }
      return res.status(500).json({ error: err });
    });
});

app.get("/new-notification", verifyUser, (req, res) => {
  let user_id = req.user;

  NotificationModel.exists({
    notification_for: user_id,
    seen: false,
    user: { $ne: user_id },
  })
    .then((result) => {
      if (result) {
        return res.status(200).json({ new_notification_available: true });
      } else {
        return res.status(200).json({ new_notification_available: false });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

app.post("/notifications", verifyUser, (req, res) => {
  let user_id = req.user;

  let { seen, page, filter, deletedDocCount } = req.body;

  let maxLimit = 10;

  let findQuery = { notification_for: user_id, user: { $ne: user_id } };

  let skipDocs = (page - 1) * maxLimit;

  if (filter != "all") {
    findQuery.type = filter;
  }

  if (deletedDocCount) {
    skipDocs -= deletedDocCount;
  }

  NotificationModel.find(findQuery)
    .skip(skipDocs)
    .limit(maxLimit)
    .populate("blog", "title blog_id")
    .populate(
      "user",
      "personal_info.fullname personal_info.username personal_info.profile_img"
    )
    .populate("comment", "comment")
    .populate("replied_on_comment", "comment")
    .populate("reply", "comment")
    .sort({ createdAt: -1 })
    .select("createdAt type seen reply")
    .then((notifications) => {
      NotificationModel.updateMany(findQuery, { seen: true })
        .skip(skipDocs)
        .limit(maxLimit)
        .then(() => {
          console.log("notification seen");
        });

      return res.status(200).json({ notifications });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

app.post("/all-notifications-count", verifyUser, (req, res) => {
  let user_id = req.user;
  let { filter } = req.body;

  let findQuery = { notification_for: user_id, user: { $ne: user_id } };

  if (filter != "all") {
    findQuery.type = filter;
  }

  NotificationModel.countDocuments(findQuery)
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err.message,
      });
    });
});
// connect to DB
connectDB();
// start server
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
