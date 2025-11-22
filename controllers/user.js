const express = require("express");
const router = express.Router();
const User = require("../models/User");
const isVerified = require("../middleware/auth");
const upload = require("../configurations/multer");
const cloudinary = require("../configurations/cloudinary");
const fs = require("fs");
const bcrypt = require("bcrypt");

// GET user by ID
router.get("/:id", isVerified, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -verificationCode -verificationCodeExpires"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id", isVerified, upload.single("profilePicture"), async (req, res) => {
  try {
    const updateData = {};

    // Password hashing
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    if (req.body.username) updateData.username = req.body.username;

    // Upload profile picture to Cloudinary
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
      });
      updateData.profilePicture = uploadResponse.secure_url;

      // Remove temp file
      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select(
      "-password -verificationCode -verificationCodeExpires"
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
