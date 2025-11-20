const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const isVerified = require("../middleware/auth.js");


router.post("/", isVerified, async (req, res) => {
  const { conversationId, sender, text } = req.body;

  try {
    const newMessage = await Message.create({
      conversationId,
      sender,
      text,
    });

    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL MESSAGES FOR A CONVERSATION
router.get("/:conversationId", isVerified, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;