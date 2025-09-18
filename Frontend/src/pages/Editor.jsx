import { createContext, useContext, useState, useEffect } from "react";
import { userContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";
import Publish from "../components/Publish";
import Loader from "../common/Loader";
import axios from "axios";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  let { blog_id } = useParams();
  const [blog, setBlog] = useState(blogStructure);
  const [editorstate, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    userAuth: { accessToken },
  } = useContext(userContext);

  // // Persist blog draft to sessionStorage whenever it changes
  // useEffect(() => {
  //   sessionStorage.setItem("blog-data", JSON.stringify(blog));
  // }, [blog]);

  // Fetch blog data once when editing an existing blog
  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "blogs/get-blog", {
        blog_id,
        draft: true,
        mode: "edit",
      })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        setLoading(false);
      })
      .catch((err) => {
        setBlog(null);
        setLoading(false);
      });
  }, [blog_id]);

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorstate,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {accessToken === null ? (
        <Navigate to="/signin" />
      ) : loading ? (
        <Loader />
      ) : editorstate == "editor" ? (
        <BlogEditor />
      ) : (
        <Publish />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
