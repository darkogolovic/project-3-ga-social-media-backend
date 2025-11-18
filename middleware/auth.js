const jwt = require('jsonwebtoken');
const User = require('../models/User.js')

 const isVerified = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });


    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Email not verified" });

    req.user = { id: decoded.id.toString() };
    next();

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};


module.exports = isVerified;
