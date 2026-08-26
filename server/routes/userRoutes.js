const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Profile
router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);

// Addresses
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);
router.put(
  "/addresses/:addressId/default",
  protect,
  setDefaultAddress
);

module.exports = router;