const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
  // createRazorpayOrder,
  cancelMyOrder,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

const { protectAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// USER ROUTES
// ==========================================

// Place a new order
router.post("/", protect, placeOrder);

// Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

// Get one specific order belonging to logged-in user
router.get("/my-orders/:id", protect, getMyOrderById);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all orders
router.get("/admin/all", protectAdmin, getAllOrders);

// RazarPay
// router.post(
//   "/create-razorpay-order",
//   protect,
//   createRazorpayOrder
// );

// Cancel logged-in user's own order
router.put(
  "/my-orders/:id/cancel",
  protect,
  cancelMyOrder
);

// Update order status
router.put(
  "/admin/:id/status",
  protectAdmin,
  updateOrderStatus
);

module.exports = router;