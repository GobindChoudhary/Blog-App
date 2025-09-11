import express from "express";
import verifyUser from "../middleware/verifyUser.middleware.js";
import createBlogController from "../controllers/createBlog.controller.js";

const router = express.Router();

router.post("/", verifyUser, createBlogController);

export default router;
