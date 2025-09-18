import blogModel from "../models/blog.model.js";
import userModel from "../models/user.model.js";
import notificationModel from "../models/notification.model.js";

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
      "activity.total_reads": -1,
      "activity.total_likes": -1,
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
  let { tag, page, author, query, limit, eleminate_blog } = req.body;

  let findQuery;

  let maxLimit = limit ? limit : 1;

  if (tag) {
    findQuery = { tags: tag, draft: false, blog_id: { $ne: eleminate_blog } };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, "i") };
  } else if (author) {
    findQuery = { draft: false, author };
  }

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
  let { tag, author, query } = req.body;
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { title: new RegExp(query, "i"), draft: false };
  } else if (author) {
    findQuery = { draft: false, author };
  }

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

export const getBlogController = (req, res) => {
  let { blog_id, draft, mode } = req.body;

  let incrementVal = mode != "edit" ? 1 : 0;
  blogModel
    .findOneAndUpdate(
      { blog_id },
      { $inc: { "activity.total_reads": incrementVal } }
    )
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname"
    )
    .select("blog_id title des content banner activity tags publishedAt  ")
    .then((blog) => {
      userModel
        .findOneAndUpdate(
          { "personal_info.username": blog.author.personal_info.username },
          {
            $inc: { "account_info.total_reads": incrementVal },
          }
        )
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
      if (blog.draft && !draft) {
        return res
          .status(500)
          .json({ error: "you can not access draft blogs" });
      }
      return res.status(200).json({ blog });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const likeBlogController = (req, res) => {
  let user_id = req.user;
  // console.log(req.body);
  let { _id, isLikedByUser } = req.body;
  // console.log(req.body);
  let incrementVal = !isLikedByUser ? 1 : -1;

  blogModel
    .findOneAndUpdate(
      { _id },
      { $inc: { "activity.total_likes": incrementVal } }
    )
    .then((blog) => {
      // console.log(blog);
      if (!isLikedByUser) {
        notificationModel
          .create({
            type: "like",
            blog: _id,
            notification_for: blog.author,
            user: user_id,
          })
          .then(() => {
            return res.status(200).json({ liked_by_user: !isLikedByUser });
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      } else {
        notificationModel
          .findOneAndDelete({
            user: user_id,
            blog: _id,
            type: "like",
          })
          .then(() => {
            return res.status(200).json({ liked_by_user: false });
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const islikeBlogController = (req, res) => {
  let user_id = req.user;
  let { _id } = req.body;

  notificationModel
    .exists({
      user: user_id,
      type: "like",
      blog: _id,
    })
    .then((result) => {
      return res.status(200).json({
        result,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};
export default {
  latestBlogController,
  trendingBlogController,
  blogCountController,
  searchBlogController,
  searchBlogCountController,
  getBlogController,
  likeBlogController,
};
