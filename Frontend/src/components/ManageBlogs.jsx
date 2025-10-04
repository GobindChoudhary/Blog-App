import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { userContext } from "../App";
import { FilterPagenationData } from "../common/FilterPagenationData";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import InPageNavigation from "./InPageNavigation";
import Loader from "../common/Loader";
import NoData from "./NoData";
import AnimationWrapper from "../common/AnimationWrapper";
import { ManagePublishBlogCard, ManageDraftBlogCard } from "./ManageBlogCard";
import LoadMoreDataBtn from "./LoadMoreDataBtn";
import { useSearchParams } from "react-router-dom";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState("");

  let activeTab = useSearchParams()[0].get("tab");

  const {
    userAuth: { accessToken },
  } = useContext(userContext);
  console.log(blogs);
  const getBlogs = ({ page, draft, deletedDocCount }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "user-written-blogs",
        {
          page,
          draft,
          query,
          deletedDocCount,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(async ({ data }) => {
        console.log(data);
        let formatedData = await FilterPagenationData({
          state: draft ? drafts : blogs,
          data: data.blogs,
          page,
          user: accessToken,
          countRoute: "user-written-blogs-count",
          data_to_send: { draft, query },
        });
        console.log(formatedData);
        if (draft) {
          setDrafts(formatedData);
        } else {
          setBlogs(formatedData);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const handleChange = (e) => {
    if (!e.target.value.length) {
      setQuery("");
      setBlogs(null);
      setDrafts(null);
    }
  };

  const handleSearch = (e) => {
    let searchQuery = e.target.value;

    setQuery(searchQuery);

    if (e.keyCode == 13 && searchQuery.length) {
      setBlogs(null);
      setDrafts(null);
    }
  };

  useEffect(() => {
    if (accessToken) {
      if (blogs == null) {
        getBlogs({ page: 1, draft: false });
      }
      if (drafts == null) {
        getBlogs({ page: 1, draft: true });
      }
    }
  }, [accessToken, blogs, drafts, query]);

  return (
    <>
      <h1 className="max-md:hidden text-xl text-dark-grey mb-3">
        Manage Blogs
      </h1>
      <Toaster />

      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="Search Blogs"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />
        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <InPageNavigation
        routes={["Published Blogs", "Drafts"]}
        defaultActiveIndex={activeTab != "draft" ? 0 : 1}
      >
        {/* Published Blogs */}
        {blogs == null ? (
          <Loader />
        ) : blogs.results.length ? (
          <>
            {blogs.results.map((blog, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                  <ManagePublishBlogCard
                    blog={{ ...blog, index: i, setStateFun: setBlogs }}
                  />
                </AnimationWrapper>
              );
            })}

            <LoadMoreDataBtn
              state={blogs}
              fetchDataFunction={getBlogs}
              additionalParam={{
                draft: false,
                deletedDocCount: blogs.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoData message="No published data" />
        )}

        {/* DRAFT */}
        {drafts == null ? (
          <Loader />
        ) : drafts.results.length ? (
          <>
            {drafts.results.map((blog, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                  <ManageDraftBlogCard
                    blog={{ ...blog, index: i, setStateFun: setDrafts }}
                  />
                </AnimationWrapper>
              );
            })}

            <LoadMoreDataBtn
              state={drafts}
              fetchDataFunction={getBlogs}
              additionalParam={{
                draft: true,
                deletedDocCount: drafts.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoData message="No draft blogs" />
        )}
      </InPageNavigation>
    </>
  );
};

export default ManageBlogs;
