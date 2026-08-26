const express = require("express");

const router = express.Router();

const {
  getKidsSizeGuide,
  updateKidsSizeGuide,
} = require(
  "../controllers/kidsSizeGuideController"
);

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// Public
router.get("/", getKidsSizeGuide);

// Admin only
router.put(
  "/",
  protect,
  adminOnly,
  updateKidsSizeGuide
);

module.exports = router;