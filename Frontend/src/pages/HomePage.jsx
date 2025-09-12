import { useEffect, useState } from "react";
import AnimationWrapper from "../common/AnimationWrapper";
import InPageNavigation from "../components/InPageNavigation";
import axios from "axios";
import BlogsCards from "../components/BlogsCards";
import Loader from "../common/Loader";
const HomePage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  //  latest blog
  const fetchLatestBlog = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "blogs/latest-blogs")
      .then(({ data }) => {
        setBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  //  trending blog
  const fetchTrendingBlog = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "blogs/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchLatestBlog();
    fetchTrendingBlog();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest */}
        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <BlogsCards
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </>
            <div className="">Trending blogs</div>
          </InPageNavigation>
        </div>
        {/* filter and trending */}
        <div className=""></div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
