const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const isVerified = require("../middleware/auth.js");

router.put("/:id/likes", isVerified, async (req, res) => {

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const userId = req.user.id.toString();
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/:postId/comments", isVerified, async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ author: req.user.id, text });
    await post.save();

    await post.populate("comments.author", "username");

    const newComment = post.comments[post.comments.length - 1];
    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/comments", isVerified, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.comments.push({
      author: req.user.id,
      text,
    });

    await post.save()
      await post.populate({
      path: "comments.author",
      select: "username",
    });
     const addedComment = post.comments[post.comments.length - 1];

    res.json(addedComment);

  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Server error'})
  }
});

router.put("/:id/comments/:commentId", isVerified, async (req, res) => {
  try {
    const { text } = req.body;
    console.log(text)

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not your comment" });
    }

    comment.text = text;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id/comments/:commentId", isVerified, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not your comment" });
    }

    comment.deleteOne();
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
