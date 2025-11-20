const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isVerified = require("../middleware/auth.js");
const User = require("../models/User.js");
const nodemailer = require("nodemailer");

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist)
      return res
        .status(401)
        .json({ message: "User with this email already exist" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new User({
      username,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires: Date.now() + 1000 * 60 * 10,
    });

    await user.save();

    await transporter.sendMail({
      from: `"Circle" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your account",
      html: `
        <p>Hello ${username},</p>
        <p>Your verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>It will expire in 10 minutes.</p>
      `,
    });

    res.status(201).json({ message: "User succesfuly created", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified)
      return res.json({ message: "User is already verified" });
    if (user.verificationCode !== verificationCode)
      return res.status(400).json({ message: "Wrong verification code" });
    if (user.verificationCodeExpires < Date.now())
      return res.status(400).json({ message: "Code expired" });

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    res.json({ message: "Email verified succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid username or password" });

    if (!user.isVerified)
      return res
        .status(400)
        .json({ message: "Email is not verified", needVerification: true });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: " Invalid username or password" });

    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.status(200).json({
        message: "Loged in succesfully",
        token,
        user: {
            id:user._id,
            email:user.email,
            username: user.username
        }
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Internal server error'})
  }
});

router.post("/resend-code", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const code = Math.floor(100000 + Math.random() * 900000);

    user.verificationCode = code;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    await sendEmail({
      to: email,
      subject: "Your verification code",
      text: `Your code is: ${code}`,
    });

    res.json({ message: "Verification code resent" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", isVerified, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
