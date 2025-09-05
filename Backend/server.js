import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/DB/db.js";
import authRoute from "./src/routes/auth.route.js";
import uploadRoute from "./src/routes/upload.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/uploadBanner", uploadRoute);

// connect to DB
connectDB();
// start server
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
