import express from "express";
import {
  trendingBlogController,
  blogCountController,
  latestBlogController,
  searchBlogController,
  searchBlogCountController,
  getBlogController,
} from "../controllers/blogs.controller.js";
import blogModel from "../models/blog.model.js";
const router = express.Router();

router.post("/latest-blogs", latestBlogController);
router.get("/trending-blogs", trendingBlogController);
router.post("/all-latest-blogs-count", blogCountController);
router.post("/search-blogs", searchBlogController);
router.post("/search-blogs-count", searchBlogCountController);
router.post("/get-blog", getBlogController);

export default router;
