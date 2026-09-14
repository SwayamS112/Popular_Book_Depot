const express = require("express");

const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
  updateVariantStock,
  updateVariantPrice,
} = require("../controllers/productController");

const { protectAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================
router.get("/", getProducts);

// ==========================================
// ADMIN
// Keep /admin/all before /:id
// ==========================================
router.get("/admin/all", protectAdmin, getAdminProducts);

router.post("/", protectAdmin, createProduct);

router.put("/:id", protectAdmin, updateProduct);

router.delete("/:id", protectAdmin, deactivateProduct);

router.put(
  "/:id/stock",
  protectAdmin,
  updateVariantStock
);

router.put(
  "/:id/price",
  protectAdmin,
  updateVariantPrice
);

// ==========================================
// SINGLE PRODUCT - PUBLIC
// ==========================================
router.get("/:id", getProductById);

module.exports = router;