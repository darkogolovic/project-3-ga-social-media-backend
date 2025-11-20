const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation.js");
const isVerified = require("../middleware/auth.js");


router.post("/", isVerified, async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:userId", isVerified, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    })
      .sort({ updatedAt: -1 })
      .populate("members", "-password");

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/find/:user1/:user2", isVerified, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.user1, req.params.user2] },
    });

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;