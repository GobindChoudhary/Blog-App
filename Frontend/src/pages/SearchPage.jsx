import { useParams } from "react-router-dom";
import InPageNavigation from "../components/InPageNavigation";
import Loader from "../common/Loader";
import AnimationWrapper from "../common/AnimationWrapper";
import BlogsCards from "../components/BlogsCards";
import NoData from "../components/NoData";
import LoadMoreDataBtn from "../components/LoadMoreDataBtn";
import { useEffect, useState } from "react";
import { FilterPagenationData } from "../common/FilterPagenationData";
import axios from "axios";

const SearchPage = () => {
  let { query } = useParams();
  const [blogs, setBlogs] = useState(null);

  const searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "blogs/search-blogs", {
        query,
        page,
      })
      .then(async ({ data }) => {
        console.log(data);
        let formatedDate = await FilterPagenationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "blogs/search-blogs-count",
          data_to_sent: { query },
          create_new_arr,
        });
        console.log(formatedDate);
        setBlogs(formatedDate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
  }, [query]);

  const resetState = () => {
    setBlogs(null);
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results from "${query}"`, "Account Matched"]}
          defaultHidden={["Accounts Matched"]}
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
            <LoadMoreDataBtn state={blogs} fetchDataFunction={searchBlogs} />
          </>
        </InPageNavigation>
      </div>
    </section>
  );
};

export default SearchPage;
