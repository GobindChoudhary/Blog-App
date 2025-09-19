import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/BlogPage";
import { userContext } from "../App";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLikedByUser,
    setLikedByUser,
    setCommentsWrapper,
  } = useContext(BlogContext);

  let {
    userAuth: { username, accessToken },
  } = useContext(userContext);

  const handleLike = () => {
    if (accessToken) {
      setLikedByUser((currentVal) => !currentVal);

      setBlog({
        ...blog,
        activity: {
          ...activity,
          total_likes: isLikedByUser ? total_likes - 1 : total_likes + 1,
        },
      });
      // console.log(isLikeByUser);

      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "blogs/like-blog",
          {
            _id,
            isLikedByUser,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data }) => {
          setLikedByUser(data.liked_by_user);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Please login to like this blog");
    }
  };

  useEffect(() => {
    if (accessToken) {
      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "blogs/islike-blog",
          {
            _id,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data: { result } }) => {
          setLikedByUser(Boolean(result));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [accessToken, _id]);
  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={handleLike}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isLikedByUser ? " bg-red/20 text-red" : " bg-grey/80"
            } `}
          >
            <i
              className={`fi ${isLikedByUser ? "fi-sr-heart" : "fi-rr-heart"}`}
            ></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button
            onClick={() => {
              setCommentsWrapper((preVal) => !preVal);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80 "
          >
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>
        <div className="flex gap-6 items-center">
          {username == author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          ) : (
            ""
          )}
          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            {" "}
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>

      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
