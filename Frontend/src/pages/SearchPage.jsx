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
import UserCard from "../components/UserCard";

const SearchPage = () => {
  let { query } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [user, setUser] = useState(null); // holds array of matched users
  const searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "blogs/search-blogs", {
        query,
        page,
      })
      .then(async ({ data }) => {
        let formatedDate = await FilterPagenationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "blogs/search-blogs-count",
          data_to_send: { query },
          create_new_arr,
        });

        setBlogs(formatedDate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUser = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "search-user", { query })
      .then(({ data: { user } }) => {
        console.log(user);
        setUser(user);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUser();
  }, [query]);

  const resetState = () => {
    setBlogs(null);
    setUser(null);
  };

  const UserCardWrapper = () => {
    return (
      <>
        {user == null ? (
          <Loader />
        ) : user.length ? (
          user.map((user, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoData message="No user found" />
        )}
      </>
    );
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

          <UserCardWrapper />
        </InPageNavigation>
      </div>
      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-cl mb-8 ">
          User related to search <i className="fi fi-rr-user mt-1"></i>
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;
