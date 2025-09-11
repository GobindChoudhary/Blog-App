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
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/uploadBanner", uploadImgRoute);
app.use("/create-blog", createBlog);
app.use("/blogs", blogs);

// connect to DB
connectDB();
// start server
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
