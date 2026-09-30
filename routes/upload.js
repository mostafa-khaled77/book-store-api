const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + file.originalname,
    );
  },
});

const uploadImage = multer({ storage });

// /api/upload
router.post("/", uploadImage.single("image"), (req, res) => {
  res.status(200).json({ message: "Image Uploaded Successfully !" });
});
module.exports = router;
