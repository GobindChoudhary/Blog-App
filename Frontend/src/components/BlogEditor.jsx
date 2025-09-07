import { Link } from "react-router-dom";
import logo from "../img/logo.png";
import AnimationWrapper from "../common/AnimationWrapper";
import defaultBanner from "../img/blog banner.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/Editor";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./Tools";

const BlogEditor = () => {
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);
  const [file, setFile] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(defaultBanner);
  console.log(blog);
  const handleBannerUpload = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      const loading = toast.loading("Uploading...");
      // 1. Create a temporary local URL for an instant preview

      const previewUrl = URL.createObjectURL(selectedFile);
      setBannerUrl(previewUrl); // Show the preview immediately

      const formData = new FormData();
      formData.append("banner", selectedFile); // Use the file directly from the event

      await axios
        .post("http://localhost:3000/uploadBanner/", formData)
        .then((res) => {
          toast.dismiss(loading);
          toast.success("Uploaded...");
          setBannerUrl(res.data.imageUrl);
          setBlog({ ...blog, banner: res.data.imageUrl });
        })
        .catchv((error) => {
          toast.error(error.response.data.message);
        });
    }
  };
  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };
  const handlePublishEvent = () => {
    if (!banner.length) {
      return toast.error("Upload a blog banner to publish it");
    }
    if (!title.length) {
      return toast.error("Write blo title to publish it");
    }
    if (textEditor.isReady) {
      textEditor.save().then((data) => {
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState("Publish");
        } else {
          return toast.error("Write something in your blog to publish it");
        }
      });
    }
  };
  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holder: "textEditor",
        data: "",
        tools: tools,
        placeholder: "Lets write a blog",
      })
    );
  }, []);
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full ">
            <div className="relation aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={bannerUrl} />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png , .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
            <textarea
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholer:opacity-40"
              placeholder="Blog Title"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
