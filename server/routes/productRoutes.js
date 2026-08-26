const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
  updateVariantStock,
  updateVariantPrice,
} = require("../controllers/productController");

const { protectAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

// Public
router.get("/", getProducts);

// Admin
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

// Single product
router.get("/:id", getProductById);

module.exports = router;