import express from "express";
import {
  trendingBlogController,
  blogCountController,
  latestBlogController,
  searchBlogController,
  searchBlogCountController,
  getBlogController,
  likeBlogController,
  islikeBlogController
} from "../controllers/blogs.controller.js";
import verifyUser from "../middleware/verifyUser.middleware.js";
const router = express.Router();

router.post("/latest-blogs", latestBlogController);
router.get("/trending-blogs", trendingBlogController);
router.post("/all-latest-blogs-count", blogCountController);
router.post("/search-blogs", searchBlogController);
router.post("/search-blogs-count", searchBlogCountController);
router.post("/get-blog", getBlogController);
router.post("/like-blog", verifyUser, likeBlogController);
router.post("/islike-blog",verifyUser, islikeBlogController);

export default router;
