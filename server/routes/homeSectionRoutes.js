const express = require("express");

const {
  getHomeSections,
  getAllHomeSectionsAdmin,
  createHomeSection,
  updateHomeSection,
  deleteHomeSection,
} = require("../controllers/homeSectionController");

const { protectAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================
router.get("/", getHomeSections);

// ==========================================
// ADMIN
// ==========================================
router.get("/admin/all", protectAdmin, getAllHomeSectionsAdmin);

router.post("/", protectAdmin, createHomeSection);

router.put("/:id", protectAdmin, updateHomeSection);

router.delete("/:id", protectAdmin, deleteHomeSection);

module.exports = router;