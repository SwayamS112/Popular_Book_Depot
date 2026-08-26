const express = require("express");

const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeCartItem,
  mergeGuestCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's cart
router.get("/", protect, getCart);

// Add product to cart
router.post("/", protect, addToCart);

// Merge guest cart after login/signup
router.post("/merge", protect, mergeGuestCart);

// Update item quantity
router.put("/:itemId", protect, updateCartQuantity);

// Remove item from cart
router.delete("/:itemId", protect, removeCartItem);

module.exports = router;