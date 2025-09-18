import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/AnimationWrapper";
import BlogInteraction from "../components/BlogInteraction";
import Loader from "../common/Loader";
import { getDate } from "../common/date";
import axios from "axios";
import BlogsCards from "../components/BlogsCards";
import BlogContent from "../components/BlogContent";

export const blogStructure = {
  title: "",
  des: "",
  content: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
  let { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLikedByUser, setLikedByUser] = useState(false);

  let {
    _id,
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "blogs/get-blog", {
        blog_id,
      })
      .then(({ data: { blog } }) => {
        console.log(blog);
        setBlog(blog);
        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "blogs/search-blogs", {
            tag: blog.tags[0],
            limit: 6,
            eleminate_blog: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlogs(data.blogs);
          });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    resetState();
    fetchBlog();
  }, [blog_id]);
  const resetState = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{ blog, setBlog, isLikedByUser, setLikedByUser }}
        >
          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <img src={banner} className="aspect-video" />
            <div className="mt-12">
              <h2>{title}</h2>
              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img src={profile_img} className="w-12 h-12 rounded-full" />

                  <p className="capitalize">
                    {fullname}
                    <br />
                    <Link to={`/user/${author_username}`} className="underline">
                      @{author_username}
                    </Link>
                  </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDate(publishedAt)}
                </p>
              </div>
            </div>

            <BlogInteraction />
            {/* {blog content} */}
            <div className="my-12 font-gelasio blog-page-content ">
              {/* {console.log(content[0].blocks)} */}
              {content[0].blocks.map((block, i) => {
                return (
                  <div key={i} className="my-4 md:my-8">
                    <BlogContent block={block} />
                  </div>
                );
              })}
            </div>
            <BlogInteraction />
            {similarBlogs != null && similarBlogs.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 front-medium">
                  Similar Blogs
                </h1>

                {similarBlogs.map((blog, i) => {
                  let {
                    author: { personal_info },
                  } = blog;

                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogsCards content={blog} author={personal_info} />
                    </AnimationWrapper>
                  );
                })}
              </>
            ) : (
              ""
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
