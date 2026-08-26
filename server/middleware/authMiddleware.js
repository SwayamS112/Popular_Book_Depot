const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      res.status(401);
      throw new Error("Not authorized. Token missing.");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error("User no longer exists");
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error(
        "Your account has been deactivated"
      );
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN ONLY
// ==========================================
const adminOnly = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next(
      new Error("Not authorized")
    );
  }

  if (req.user.role !== "admin") {
    res.status(403);
    return next(
      new Error("Admin access required")
    );
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
};