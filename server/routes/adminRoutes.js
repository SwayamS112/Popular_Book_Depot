const express = require("express");

const {
  getAdminDashboard,
  getAdminCustomers,
  getAdminCustomerById,
  updateCustomerStatus,
} = require("../controllers/adminController");

const {
  uploadMedia,
  deleteMedia,
} = require("../controllers/mediaController");

const {
  protectAdmin,
} = require("../middleware/adminMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ==========================================
// ADMIN DASHBOARD
// ==========================================
router.get(
  "/dashboard",
  protectAdmin,
  getAdminDashboard
);

// ==========================================
// ADMIN CUSTOMERS
// ==========================================
router.get(
  "/customers",
  protectAdmin,
  getAdminCustomers
);

router.get(
  "/customers/:id",
  protectAdmin,
  getAdminCustomerById
);

router.put(
  "/customers/:id/status",
  protectAdmin,
  updateCustomerStatus
);

// ==========================================
// MEDIA / CLOUDINARY
// ==========================================
router.post(
  "/media/upload",
  protectAdmin,
  upload.single("file"),
  uploadMedia
);

router.delete(
  "/media",
  protectAdmin,
  deleteMedia
);

module.exports = router;