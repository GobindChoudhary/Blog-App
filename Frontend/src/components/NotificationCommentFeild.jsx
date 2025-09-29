import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { userContext } from "../App";
import axios from "axios";

const NotificationCommentFeild = ({
  _id,
  blog_author,
  index = undefined,
  replyingTo = undefined,
  setReplying,
  notification_id,
  notificationData,
}) => {
  const [comment, setComment] = useState("");

  let { _id: user_id } = blog_author;
  let {
    userAuth: { accessToken },
  } = useContext(userContext);
  console.log(notificationData);
  let {
    notifications,
    notifications: { results },
    setNotifications,
  } = notificationData;

  const handleComment = () => {
    if (!comment.length) {
      return toast.error("Write something to leave a comment");
    }
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "add-comment",
        {
          _id,
          blog_author: user_id,
          comment,
          replying_to: replyingTo,
          notification_id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(({ data }) => {
        setReplying(false);

        const newResults = [...results];
        newResults[index] = {
          ...newResults[index],
          reply: { comment, _id: data._id },
        };

        setNotifications({ ...notifications, results: newResults });
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
        placeholder="Leave a reply..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto "
      ></textarea>
      <button onClick={handleComment} className="btn-dark mt-5 px-10">
        Reply
      </button>
    </>
  );
};

export default NotificationCommentFeild;
