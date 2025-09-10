import express from "express";
import multer from "multer";
import imagekit from "../utils/imagekit.js";

const router = express.Router();
const upload = multer(); // store file in memory

router.post("/", upload.single("banner"), async (req, res) => {
  console.log(req.file);
  try {
    const result = await imagekit.upload({
      file: req.file.buffer, // actual file
      fileName: req.file.originalname, // file name
      folder: "/blog-banners", // optional folder
    });

    res.json({
      message: "Banner uploaded successfully",
      imageUrl: result.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
