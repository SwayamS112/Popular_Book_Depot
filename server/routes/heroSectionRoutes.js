const express = require("express");

const {
  getHeroSection,
  getAdminHeroSection,
  updateHeroSection,
} = require("../controllers/heroSectionController");

const { protectAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

/*
=========================================================
PUBLIC
=========================================================
*/

router.get("/", getHeroSection);

/*
=========================================================
ADMIN
=========================================================
*/

router.get("/admin", protectAdmin, getAdminHeroSection);

router.put("/admin", protectAdmin, updateHeroSection);

module.exports = router;