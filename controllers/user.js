const express = require("express");
const router = express.Router();
const User = require("../models/User");
const isVerified = require("../middleware/auth.js");
const upload = require('../configurations/multer.js');
const cloudinary = require('../configurations/cloudinary.js');
const fs = require('fs');


router.get("/:id", isVerified, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -verificationCode -verificationCodeExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", isVerified, upload.single("profilePicture"), async (req, res) => {
  try {
   
    if (req.user.id.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: "You can update only your profile" });
    }

    let updateData = {};
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.email) updateData.email = req.body.email;

    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures"
      });

      updateData.profilePicture = uploadResponse.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password -verificationCode -verificationCodeExpires");

    res.json(updatedUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



module.exports = router;