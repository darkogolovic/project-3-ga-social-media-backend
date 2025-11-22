const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const isVerified = require("../middleware/auth.js");
const { default: mongoose } = require("mongoose");


router.post("/", isVerified, async (req, res) => {
  const { conversationId, sender, text } = req.body;

  try {
    const newMessage = await Message.create({
      conversationId:conversationId,
      sender,
      text,
    });

    res.json(newMessage);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:conversationId", isVerified, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: new mongoose.Types.ObjectId( req.params.conversationId)
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;