import { Link } from "react-router-dom";
import { getDate } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentFeild from "./NotificationCommentFeild";
import { userContext } from "../App";
import axios from "axios";

const NotificationCard = ({ data, index, notificationState }) => {
  const {
    type,
    reply,
    seen,
    createdAt,
    comment,
    replied_on_comment,
    user,
    user: {
      personal_info: { profile_img, fullname, username },
    },
    blog: { _id, blog_id, title },
    _id: notification_id,
  } = data;

  const {
    userAuth: {
      username: author_username,
      profile_img: author_profile_img,
      accessToken,
    },
  } = useContext(userContext);

  let {
    notifications,
    notifications: { results, totalDocs },
    setNotifications,
  } = notificationState;

  let [isrepling, setReplying] = useState(false);

  const handleReplyClick = () => {
    setReplying((preVal) => !preVal);
  };

  const handleDelete = (comment_id, type, target) => {
    target.setAttribute("disabled", true);

    axios
      .post(
        `${import.meta.env.VITE_SERVER_DOMAIN}delete-comment`,
        { _id: comment_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        let newResults;
        if (type === "comment") {
          // Filter out the deleted notification
          newResults = results.filter((_, i) => i !== index);
        } else {
          // Create a new array and update the specific notification to remove the reply
          newResults = results.map((notification, i) => {
            if (i === index) {
              const { reply, ...rest } = notification;
              return rest;
            }
            return notification;
          });
        }

        target.removeAttribute("disabled");
        setNotifications({
          ...notifications,
          results: newResults,
          totalDocs: notifications.totalDocs - 1,
          deletedDocCount: (notifications.deletedDocCount || 0) + 1,
        });
      })
      .catch((err) => {
        console.log(err);
        target.removeAttribute("disabled");
      });
  };
  console.log(seen);
  return (
    <div
      className={`p-6 border-b border-grey border-l-black ${
        !seen ? "border-l-2" : ""
      } `}
    >
      <div className="flex gap-5 mb-3 ">
        <img src={profile_img} className="w-14 h-14 flex-none rounded-full" />
        <div className="w-full ">
          <h1 className="font-medium text-xl text-dark-grey">
            <span className="lg:inline-block hidden capitalize">
              {fullname}
            </span>
            <Link
              className="mx-1 text-black underline "
              to={`/user/${username}`}
            >
              @{username}
            </Link>
            <span className="font-normal">
              {type == "like"
                ? "liked you blog"
                : type == "comment"
                ? "commented on"
                : "replied on"}
            </span>
          </h1>

          {type == "reply" ? (
            <div className="p-4 mt-4 rounded-md bg-grey">
              {replied_on_comment ? (
                <p>{replied_on_comment.comment}</p>
              ) : (
                <p className="text-dark-grey">Original comment was deleted</p>
              )}
            </div>
          ) : (
            <Link
              to={`/blogs/${blog_id}`}
              className="font-medium text-dark-grey hover:underline line-clamp-1"
            >{`"${title}"`}</Link>
          )}
        </div>
      </div>
      {type != "like" ? (
        comment ? (
          <p className="ml-14 pl-5 font-gelasio text-xl my-5">
            {comment.comment}
          </p>
        ) : (
          ""
        )
      ) : (
        ""
      )}

      <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
        <p>{getDate(createdAt)}</p>
        {type != "like" && comment ? (
          <>
            {!reply ? (
              <button
                onClick={handleReplyClick}
                className="underline hover:text-black"
              >
                Reply
              </button>
            ) : (
              ""
            )}
            <button
              onClick={(e) => {
                handleDelete(comment._id, "comment", e.target);
              }}
              className="underline hover:text-black"
            >
              Delete
            </button>
          </>
        ) : (
          ""
        )}
      </div>

      {isrepling ? (
        <div className="mt-8">
          <NotificationCommentFeild
            _id={_id}
            blog_author={user}
            index={index}
            replyingTo={comment._id}
            setReplying={setReplying}
            notification_id={notification_id}
            notificationData={notificationState}
          />
        </div>
      ) : (
        ""
      )}

      {console.log(reply)}
      {reply ? (
        <div className="ml-20 p-5 bg-grey mt-5 rounded-md">
          <div className="flex gap-3 mb-3 ">
            <img src={author_profile_img} className="w-8 h-8 rounded-full" />
            <div className="">
              <h1 className="font-medium text-xl text-dark-grey">
                <Link
                  to={`/user/${author_username}`}
                  className="mx-1 text-black underline"
                >
                  @{author_username}
                </Link>

                <span className="font-normal">replied to</span>
                <Link
                  to={`/user/${username}`}
                  className="mx-1 text-black underline"
                >
                  @{username}
                </Link>
              </h1>
            </div>
          </div>
          <p className="ml-14 font-gelasio text-xl my-2">{reply.comment}</p>
          <button
            onClick={(e) => {
              handleDelete(comment._id, "reply", e.target);
            }}
            className="underline hover:text-black ml-14 mt-2"
          >
            Delete
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotificationCard;
