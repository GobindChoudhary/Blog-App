import { useEffect, useState } from "react";
import AnimationWrapper from "../common/AnimationWrapper";
import InPageNavigation from "../components/InPageNavigation";
import axios from "axios";
import BlogsCards from "../components/BlogsCards";
import Loader from "../common/Loader";
import MinimalBlogPost from "../components/MinimalBlogPost";
import { activeTabRef } from "../components/InPageNavigation";
import NoData from "../components/NoData";
import { FilterPagenationData } from "../common/FilterPagenationData";
import LoadMoreDataBtn from "../components/LoadMoreDataBtn";

const HomePage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");
  let categories = [
    "programming",
    "hollywood",
    "film making",
    "social media",
    "cooking",
    "tech",
    "finances",
    "travel",
  ];
  //  latest blog
  const fetchLatestBlog = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "blogs/latest-blogs", { page })
      .then(async ({ data }) => {
        console.log(data);
        let formatedDate = await FilterPagenationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "blogs/all-latest-blogs-count",
        });
        console.log(formatedDate);
        setBlogs(formatedDate);
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

  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "blogs/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await FilterPagenationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "blogs/search-blogs-count",
          data_to_sent: { tag: pageState },
        });

        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
        return resizeBy.state(500).json({ error: err.message });
      });
  };
  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlogs(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };
  useEffect(() => {
    activeTabRef.current.click();

    if (pageState == "home") {
      fetchLatestBlog({ page: 1 });
    } else fetchBlogsByCategory({ page: 1 });
    if (!trendingBlogs) {
      fetchTrendingBlog();
    }
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => {
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
              ) : (
                <NoData message="No blogs Published" />
              )}
              <LoadMoreDataBtn
                state={blogs}
                fetchDataFunction={
                  pageState == "home" ? fetchLatestBlog : fetchBlogsByCategory
                }
              />
            </>
            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs ? (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoData message="No trending blogs " />
            )}
          </InPageNavigation>
        </div>
        {/* filter and trending */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div className="">
              <h1 className="font-member text-xl mb-8">
                Stories form all interests
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      key={category}
                      onClick={loadBlogByCategory}
                      className={
                        "tag  " +
                        (pageState === category ? " bg-black text-white " : " ")
                      }
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className=" ">
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>{" "}
              </h1>
              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoData message="No trending blogs " />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
