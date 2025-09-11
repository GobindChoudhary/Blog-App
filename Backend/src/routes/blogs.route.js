import express from "express";
import { latestBlogController } from "../controllers/blogs.controller.js";
const router = express.Router();

router.get("/latest-blog", latestBlogController);

export default router;
