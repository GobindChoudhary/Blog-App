import express from "express";
import { latestBlogController } from "../controllers/blogs.controller.js";
import { trendingBlogController } from "../controllers/blogs.controller.js";
const router = express.Router();

router.get("/latest-blogs", latestBlogController);
router.get("/trending-blogs", trendingBlogController);

export default router;
