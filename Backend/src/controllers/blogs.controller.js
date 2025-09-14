import blogModel from "../models/blog.model.js";

export const latestBlogController = (req, res) => {
  let { page } = req.body;
  let maxLimit = 2;
  blogModel
    .find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id ")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const blogCountController = (req, res) => {
  blogModel
    .countDocuments({ draft: false })
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({
        error: err.message,
      });
    });
};

export const trendingBlogController = (req, res) => {
  let maxLimit = 5;
  blogModel
    .find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({
      "activity.total_read": -1,
      "activity.total_like": -1,
      publishedAt: -1,
    })
    .select("blog_id title publishedAt -_id ")
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const searchBlogController = (req, res) => {
  let { tag, page } = req.body;

  let findQuery = { tags: tag, draft: false };

  let maxLimit = 5;

  blogModel
    .find(findQuery)
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({
      publishedAt: -1,
    })
    .select("blog_id title des banner activity tags publishedAt -_id ")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const searchBlogCountController = (req, res) => {
  let { tag } = req.body;
  let findQuery = { tags: tag, draft: false };

  blogModel
    .countDocuments(findQuery)
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
};

export default {
  latestBlogController,
  trendingBlogController,
  blogCountController,
  searchBlogController,
  searchBlogCountController,
};
