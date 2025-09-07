import { createContext, useContext, useState } from "react";
import { userContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";
import Publish from "../components/Publish";

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
  const [blog, setBlog] = useState(blogStructure);
  const [editorstate, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const {
    userAuth: { accessToken },
  } = useContext(userContext);

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
      ) : editorstate == "editor" ? (
        <BlogEditor />
      ) : (
        <Publish />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
