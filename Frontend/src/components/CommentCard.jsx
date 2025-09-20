import { useContext, useState } from "react";
import { getDate } from "../common/date";
import { userContext } from "../App";
import toast from "react-hot-toast";
import CommentField from "./CommentField";
import { BlogContext } from "../pages/BlogPage";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {
  const {
    commented_by: {
      personal_info: { fullname, profile_img, username: commented_by_username },
    },
    commentedAt,
    comment,
    _id,
    children,
  } = commentData;

  const {
    blog,
    blog: {
      comments,
      activity,
      activity: { total_parent_comments },
      comments: { result: commentsArr },
      author: {
        personal_info: { username: blog_author },
      },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const {
    userAuth: { accessToken, username },
  } = useContext(userContext);

  const [isReplying, setReplying] = useState(false);

  const getParentIndex = () => {
    let startingPoint = index - 1;
    try {
      while (
        commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel
      ) {
        startingPoint--;
      }
    } catch {
      startingPoint = undefined;
    }
    return startingPoint;
  };

  const removeCommentsCards = (startingPoint, isDelete = false) => {
    if (commentsArr[startingPoint]) {
      while (
        commentsArr[startingPoint] &&
        commentsArr[startingPoint].childrenLevel > commentData.childrenLevel
      ) {
        commentsArr.splice(startingPoint, 1);
        if (!commentsArr[startingPoint]) break;
      }
    }

    if (isDelete) {
      const parentIndex = getParentIndex();
      if (parentIndex !== undefined) {
        commentsArr[parentIndex].children = commentsArr[
          parentIndex
        ].children.filter((child) => child !== _id);
        if (!commentsArr[parentIndex].children.length) {
          commentsArr[parentIndex].isReplyLoaded = false;
        }
      }
      commentsArr.splice(index, 1);
    }

    if (commentData.childrenLevel === 0 && isDelete) {
      setTotalParentCommentsLoaded((prev) => prev - 1);
    }

    setBlog({
      ...blog,
      comments: { result: commentsArr },
      activity: {
        ...activity,
        total_parent_comment:
          total_parent_comments - commentData.childrenLevel === 0 && isDelete
            ? 1
            : 0,
      },
    });
  };

  const handleReplyClick = () => {
    if (!accessToken) return toast.error("Login first to leave a reply");
    setReplying((prev) => !prev);
  };

  const hideReply = () => {
    commentData.isReplyLoaded = false;
    removeCommentsCards(index + 1);
  };

  const loadReplies = ({ skip = 0 }) => {
    if (children.length) {
      hideReply();
      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "get-replies", { _id, skip })
        .then(({ data: { replies } }) => {
          commentData.isReplyLoaded = true;
          replies.forEach((reply, i) => {
            reply.childrenLevel = commentData.childrenLevel + 1;
            commentsArr.splice(index + 1 + i + skip, 0, reply);
          });
          setBlog({
            ...blog,
            comments: { ...comments, result: commentsArr },
          });
        });
    }
  };

  const deleteComment = (e) => {
    e.target.setAttribute("disabled", true);
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "delete-comment",
        { _id },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(() => {
        e.target.removeAttribute("disabled");
        removeCommentsCards(index + 1, true);
      })
      .catch(console.log);
  };

  return (
    <div
      className="w-full"
      style={{ paddingLeft: `${leftVal * 2}px` }} // slightly more indentation for nested replies
    >
      <div className="my-3 p-4 rounded-lg border border-grey  bg-white ">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={profile_img}
            alt={fullname}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm -dark-grey">
              {fullname}{" "}
              <span className="text-dark-grey text-sm font-sm">
                @{commented_by_username}
              </span>
            </p>
            <p className="text-xs text-gray-400">{getDate(commentedAt)}</p>
          </div>
        </div>

        <p className="text-gray-800 text-base ml-1">{comment}</p>

        <div className="flex flex-wrap gap-2 mt-3 items-center">
          {commentData.isReplyLoaded ? (
            <button
              onClick={hideReply}
              className="text-gray-600 p-1 px-3 hover:bg-gray-100 rounded-md flex items-center gap-1 text-sm"
            >
              <i className="fi fi-rs-comment-dots"></i> Hide reply
            </button>
          ) : (
            <button
              onClick={loadReplies}
              className="text-gray-600 p-1 px-3 hover:bg-gray-100 rounded-md flex items-center gap-1 text-sm"
            >
              <i className="fi fi-rs-comment-dots"></i> {children.length}{" "}
              replies
            </button>
          )}

          <button
            onClick={handleReplyClick}
            className="underline text-sm text-gray-600 hover:text-gray-800"
          >
            Reply
          </button>

          {(username === commented_by_username || username === blog_author) && (
            <button
              onClick={deleteComment}
              className="ml-4 text-red-600 hover:text-red-800 flex-shrink-0 py-1 px-2 border border-grey"
              title="Delete comment"
            >
              <i className="fi fi-rr-trash"></i>
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-4">
            <CommentField
              action="reply"
              index={index}
              replyingTo={_id}
              setReplying={setReplying}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
