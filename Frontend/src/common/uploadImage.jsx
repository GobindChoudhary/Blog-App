import axios from "axios";
import { toast } from "react-hot-toast";

const uploadImageByFile = async (file) => {
  if (!file) return { success: 0 };

  const loading = toast.loading("Uploading...");

  try {
    const formData = new FormData();
    formData.append("banner", file);

    const res = await axios.post(
      "http://localhost:3000/uploadBanner/",
      formData
    );

    toast.dismiss(loading);
    toast.success("Uploaded 👍");

    // ✅ return in the correct Editor.js format
    return {
      success: 1,
      file: {
        url: res.data.imageUrl, // make sure your backend responds with { imageUrl: "..." }
      },
    };
  } catch (error) {
    toast.dismiss(loading);
    toast.error(error.response?.data?.message || "Upload failed");

    return {
      success: 0,
    };
  }
};

export default uploadImageByFile;
