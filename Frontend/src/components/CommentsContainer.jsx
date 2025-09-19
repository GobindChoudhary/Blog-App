import React, { useContext } from "react";
import { BlogContext } from "../pages/BlogPage";
import CommentField from "./CommentField";
import axios from "axios";
import NoData from "./NoData";
import AnimationWrapper from "../common/AnimationWrapper";
import CommentCard from "./commentCard";

export const fetchComments = async ({
  skip = 0,
  blog_id,
  setParentCommentCountFunction,
  comment_array = null,
}) => {
  let res;
  await axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "get-blog-comment", {
      blog_id,
      skip,
    })
    .then(({ data }) => {
      data.map((comment) => {
        comment.childrenLevel = 0;
      });

      setParentCommentCountFunction((preVal) => preVal + data.length);

      if (comment_array == null) {
        res = { result: data };
      } else {
        res = { result: [...comment_array, ...data] };
      }
    });
  return res;
};

const CommentsContainer = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      comments: { result: commentsArr },
      activity: { total_parent_comments },
    },
    setBlog,
    totalParentCommentsLoaded,
    commentsWrapper,
    setCommentsWrapper,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const loadMore = async () => {
  let newCommentArr = await fetchComments({
  skip: totalParentCommentsLoaded,
  blog_id: _id,
  setParentCommentCountFunction: setTotalParentCommentsLoaded,
  comment_array: commentsArr,
});
    setBlog({
      ...blog,
      comments: newCommentArr,
    });
  };
  return (
    <div
      className={
        "max-sm:full fixed " +
        (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-auto overflow-x-hidden"
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
          {title}
        </p>
        <button
          onClick={() => {
            setCommentsWrapper((preVal) => !preVal);
          }}
          className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
        >
          <i className="fi fi-br-cross text-2xl mt-1"></i>
        </button>
      </div>

      <hr className="border-grey my-8 w-[120%] -ml-10" />

      <CommentField action="comment" />
      {commentsArr && commentsArr.length ? (
        commentsArr.map((comment, i) => {
          return (
            <AnimationWrapper key={i}>
              <CommentCard
                index={i}
                leftVal={comment.childrenLevel * 4}
                commentData={comment}
              />
            </AnimationWrapper>
          );
        })
      ) : (
        <NoData message="No comments" />
      )}

      {total_parent_comments > totalParentCommentsLoaded ? (
        <button
          onClick={loadMore}
          className="text-dark-grey px-3 hover:bg-grey/70 rounded-md flex items-center gap-2"
        >
          Load more
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default CommentsContainer;
