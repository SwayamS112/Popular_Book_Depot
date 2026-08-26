const express = require("express");

const { protectAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/dashboard", protectAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to admin dashboard",
    admin: req.admin,
  });
});

module.exports = router;