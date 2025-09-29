import { useContext, useState } from "react";
import { userContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/BlogPage";

const CommentField = ({
  action,
  index = undefined,
  replyingTo = undefined,
  setReplying,
}) => {
  const {
    blog,
    blog: {
      _id,
      author: { _id: blog_author },
      activity,
      activity: { total_comments, total_parent_comments },
      comments,
      comments: { result: commentsArr },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const {
    userAuth: { accessToken, username, profile_img, fullname },
  } = useContext(userContext);
  const [comment, setComment] = useState();

  const handleComment = () => {
    if (!accessToken) {
      return toast.error("Login first to leave a comment");
    }
    if (!comment.length) {
      return toast.error("Write something to leave a comment");
    }
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "add-comment",
        {
          _id,
          blog_author,
          comment,
          replying_to: replyingTo,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(({ data }) => {
        console.log(data);
        setComment("");
        data.commented_by = {
          personal_info: {
            fullname,
            username,
            profile_img,
          },
        };

        let newCommentArr;

        if (replyingTo) {
          const newComments = [...commentsArr];
          const parentComment = { ...newComments[index] };
          parentComment.children = [
            ...(parentComment.children || []),
            data._id,
          ];
          parentComment.isReplyLoaded = true;

          data.childrenLevel = parentComment.childrenLevel + 1;
          data.parentIndex = index;

          newComments[index] = parentComment;
          newComments.splice(index + 1, 0, data);

          newCommentArr = newComments;
          setReplying(false);
        } else {
          data.childrenLevel = 0;
          newCommentArr = [data, ...commentsArr];
        }

        let parentCommentIncrementVal = replyingTo ? 0 : 1;

        setBlog((prevBlog) => {
          const updatedComments = {
            ...prevBlog.comments,
            result: newCommentArr,
          };
          const updatedActivity = {
            ...prevBlog.activity,
            total_comments: prevBlog.activity.total_comments + 1,
            total_parent_comments:
              prevBlog.activity.total_parent_comments +
              parentCommentIncrementVal,
          };
          return {
            ...prevBlog,
            comments: updatedComments,
            activity: updatedActivity,
          };
        });

        setTotalParentCommentsLoaded(
          (preVal) => preVal + parentCommentIncrementVal
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto "
      ></textarea>
      <button onClick={handleComment} className="btn-dark mt-5 px-10">
        {action}
      </button>
    </>
  );
};

export default CommentField;
