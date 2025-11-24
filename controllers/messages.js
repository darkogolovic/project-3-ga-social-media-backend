const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const isVerified = require("../middleware/auth.js");
const { default: mongoose } = require("mongoose");
const client = require("../configurations/openai.js");


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
router.post("/:id/summarize", isVerified, async (req, res) => {
  try {
    
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

   
    const response = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "user",
          content: `Return ONLY the summary, no prefixes. Summary under 10 words: ${message.text}`,
        },
      ],
    });

    const summary = response.choices[0].message.content.trim();

    // update-uj poruku
    message.summary = summary;
    await message.save();

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;