const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const isVerified = require("../middleware/auth.js");
const upload = require("../configurations/multer.js");
const cloudinary = require("../configurations/cloudinary.js");
const fs = require("fs");
const mongoose = require("mongoose");

router.get("/", isVerified, async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;

    let skip = (page - 1) * limit;
    const posts = await Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", isVerified, upload.single("image"), async (req, res) => {
  try {
    let newPost = {};
    if (req.body.content) newPost.content = req.body.content;
    if (req.file) {
      uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "images",
      });
      newPost.image = uploadedImage.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const post = await Post.create({
      author: req.user._id,
      ...newPost,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", isVerified, async (req, res) => {
  try {
    const singlePost = await Post.findById(req.params.id)
      .populate("author", "username profilePicture")
      .populate("comments.author", "username profilePicture");
    if (!singlePost) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(singlePost);
  } catch (error) {
   
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", isVerified, upload.single("image"), async (req, res) => {
  try {
    const postForEdit = await Post.findById(req.params.id);

    if (!postForEdit)
      return res.status(404).json({ message: "Post not found" });

    const authorId =
      postForEdit.author instanceof mongoose.Types.ObjectId
        ? postForEdit.author.toHexString()
        : postForEdit.author.toString();

    const userId =
      req.user.id instanceof mongoose.Types.ObjectId
        ? req.user.id.toHexString()
        : req.user.id.toString();

    if (authorId !== userId) {
      return res.status(403).json({ message: "Not your post" });
    }

    if (req.body.content) {
      postForEdit.content = req.body.content;
    }

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "images",
      });

      if (postForEdit.image) {
        const segments = postForEdit.image.split("/");
        const lastSegment = segments[segments.length - 1];
        const publicId = `images/${lastSegment.split(".")[0]}`;
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.log(
            "Could not delete old image from Cloudinary:",
            err.message
          );
        }
      }

      postForEdit.image = uploadedImage.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const updatedPost = await postForEdit.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", isVerified, async (req, res) => {
  try {
    const postForDelete = await Post.findById(req.params.id);
    if(!postForDelete) return res.status(404).json({ message: "Post not found" });
    const authorId =
      postForDelete.author instanceof mongoose.Types.ObjectId
        ? postForDelete.author.toHexString()
        : postForDelete.author.toString();

    const userId =
      req.user.id instanceof mongoose.Types.ObjectId
        ? req.user.id.toHexString()
        : req.user.id.toString();

    if (authorId !== userId)  return res.status(403).json({ message: "Not your post" });
    
    await postForDelete.deleteOne();
    res.status(200).json({message: 'Post succesfully deleted'})

    
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Server Error'})
  }
});

module.exports = router;
