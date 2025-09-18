import { nanoid } from "nanoid";
import blogModel from "../models/blog.model.js";
import userModel from "../models/user.model.js";
const createBlogController = (req, res) => {
  const authorId = req.user;

  let { title, des, content, banner, tags, draft, id } = req.body;
  if (!title.length) {
    return res.status(403).json({
      error: "You must provide a title",
    });
  }
  if (!draft) {
    if (!des.length || des.length > 200) {
      return res.status(403).json({
        error: "You must provide a blog description under 200 character",
      });
    }
    if (!tags.length || tags.length > 10) {
      return res.status(403).json({
        error: "You must provide a tags to publish it",
      });
    }
    if (!banner.length) {
      return res.status(403).json({
        error: "You must provide a blog banner to publish it",
      });
    }
   
    if (!content.blocks.length) {
      return res.status(403).json({
        error: "There must be some blog content to publish it",
      });
    }
  }

  tags = tags.map((t) => t.toLowerCase());
  let blog_id =
    id ||
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid();

  if (id) {
    blogModel
      .findOneAndUpdate(
        { blog_id },
        { title, des, banner, content, tags, draft: draft ? draft : false }
      )
      .then((blog) => {
        return res.status(200).json({ id: blog_id });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } else {
    blogModel
      .create({
        title,
        des,
        content,
        banner,
        tags,
        draft,
        author: authorId,
        blog_id,
        draft: Boolean(draft),
      })
      .then((blog) => {
        let incrementVal = draft ? 0 : 1;
        userModel
          .findOneAndUpdate(
            { _id: authorId },
            {
              $inc: { "account_info.total_posts": incrementVal },
              $push: {
                blogs: blog._id,
              },
            }
          )
          .then((user) => {
            return res.status(200).json({ id: blog.blog_id });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ error: "Failed to update total post number" });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  }
};

export default createBlogController;
