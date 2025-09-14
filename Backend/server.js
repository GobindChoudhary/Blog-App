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

// connect to DB
connectDB();
// start server
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
