const Product = require("../models/Product");
const {isValidProductCategory,} = require("../utils/productCategories");

// ==========================================
// HELPER: CHECK IF A PRODUCT HAS ANY STOCK
// ==========================================
const hasProductStock = (product) => {
  return product.variants.some((variant) =>
    variant.sizes.some((size) => size.stock > 0)
  );
};

// ==========================================
// GET ALL PRODUCTS - PUBLIC
// ==========================================
const getProducts = async (req, res, next) => {
  try {
    const {
      section,
      category,
      subcategory,
      brand,
      featured,
      newArrival,
      collection,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {
      isActive: true,
    };

    if (section) {
      filter.section = section.toLowerCase();
    }

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (subcategory) {
      filter.subcategory = subcategory.toLowerCase();
    }

    if (brand) {
      filter.brand = new RegExp(`^${brand}$`, "i");
    }

    if (featured !== undefined) {
      filter.isFeatured = featured === "true";
    }

    if (newArrival !== undefined) {
      filter.isNewArrival = newArrival === "true";
    }

    // Collection filtering
    if (collection === "most-popular") {
      filter.isPopular = true;
    }

    if (collection === "best-sellers") {
      filter.isBestSeller = true;
    }

    if (collection === "new-arrivals") {
      filter.isNewArrival = true;
    }

    // Price filtering is based on at least one variant
    if (minPrice || maxPrice) {
      filter.variants = {
        $elemMatch: {},
      };

      if (minPrice) {
        filter.variants.$elemMatch.sellingPrice = {
          ...filter.variants.$elemMatch.sellingPrice,
          $gte: Number(minPrice),
        };
      }

      if (maxPrice) {
        filter.variants.$elemMatch.sellingPrice = {
          ...filter.variants.$elemMatch.sellingPrice,
          $lte: Number(maxPrice),
        };
      }
    }

    const currentPage = Math.max(Number(page), 1);

    const itemsPerPage = Math.min(
      Math.max(Number(limit), 1),
      50
    );

    const skip = (currentPage - 1) * itemsPerPage;

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage);

    const productsWithStockStatus = products.map(
      (product) => ({
        ...product.toObject(),
        inStock: hasProductStock(product),
      })
    );

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      currentPage,
      totalPages: Math.ceil(
        totalProducts / itemsPerPage
      ),
      products: productsWithStockStatus,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET SINGLE PRODUCT - PUBLIC
// ==========================================
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(200).json({
      success: true,
      product: {
        ...product.toObject(),
        inStock: hasProductStock(product),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CREATE PRODUCT - ADMIN ONLY
// ==========================================
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      section,
      category,
      subcategory,
      description,
      variants,
      returnPolicy,
      returnNote,
      isActive,
      isFeatured,
      isPopular,
      isBestSeller,
      isNewArrival,
    } = req.body;

    // Required fields
    if (
      !name ||
      !brand ||
      !section ||
      !category ||
      !subcategory ||
      !variants
    ) {
      res.status(400);
      throw new Error(
        "Please provide all required product fields"
      );
    }

    const normalizedSection =
      section.toLowerCase();

    const normalizedCategory =
      category.toLowerCase();

    const normalizedSubcategory =
      subcategory.toLowerCase();

    // Validate section and subcategory
    if (
      !isValidProductCategory(
        normalizedSection,
        normalizedSubcategory
      )
    ) {
      res.status(400);
      throw new Error(
        `Invalid subcategory "${subcategory}" for section "${section}"`
      );
    }

    // Accessories should always use category "accessories"
    if (
      normalizedSection === "accessories" &&
      normalizedCategory !== "accessories"
    ) {
      res.status(400);
      throw new Error(
        "Accessories must use category 'accessories'"
      );
    }

    // Men, women and kids should use category "shoes"
    if (
      ["men", "women", "kids"].includes(
        normalizedSection
      ) &&
      normalizedCategory !== "shoes"
    ) {
      res.status(400);
      throw new Error(
        "Men, women and kids products must use category 'shoes'"
      );
    }

    // Validate variants
    if (
      !Array.isArray(variants) ||
      variants.length === 0
    ) {
      res.status(400);
      throw new Error(
        "At least one product variant is required"
      );
    }

    const product = await Product.create({
      name,
      brand,

      section: normalizedSection,
      category: normalizedCategory,
      subcategory: normalizedSubcategory,

      description,
      variants,
      returnPolicy,
      returnNote,

      isActive:
        isActive !== undefined
          ? isActive
          : true,

      isFeatured:
        isFeatured !== undefined
          ? isFeatured
          : false,

      isPopular:
        isPopular !== undefined
          ? isPopular
          : false,

      isBestSeller:
        isBestSeller !== undefined
          ? isBestSeller
          : false,

      isNewArrival:
        isNewArrival !== undefined
          ? isNewArrival
          : true,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE PRODUCT - ADMIN ONLY
// ==========================================
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Get the final values after the update
    const finalSection =
      req.body.section !== undefined
        ? String(req.body.section).toLowerCase()
        : product.section;

    const finalCategory =
      req.body.category !== undefined
        ? String(req.body.category).toLowerCase()
        : product.category;

    const finalSubcategory =
      req.body.subcategory !== undefined
        ? String(req.body.subcategory).toLowerCase()
        : product.subcategory;

    // Validate section and subcategory
    if (
      !isValidProductCategory(
        finalSection,
        finalSubcategory
      )
    ) {
      res.status(400);
      throw new Error(
        `Invalid subcategory "${finalSubcategory}" for section "${finalSection}"`
      );
    }

    // Accessories must use accessories category
    if (
      finalSection === "accessories" &&
      finalCategory !== "accessories"
    ) {
      res.status(400);
      throw new Error(
        "Accessories must use category 'accessories'"
      );
    }

    // Men, women and kids must use shoes category
    if (
      ["men", "women", "kids"].includes(finalSection) &&
      finalCategory !== "shoes"
    ) {
      res.status(400);
      throw new Error(
        "Men, women and kids products must use category 'shoes'"
      );
    }

    const allowedFields = [
      "name",
      "brand",
      "description",
      "variants",
      "returnPolicy",
      "returnNote",
      "isActive",
      "isFeatured",
      "isPopular",
      "isBestSeller",
      "isNewArrival",
    ];

    // Update normal fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Update validated category fields
    product.section = finalSection;
    product.category = finalCategory;
    product.subcategory = finalSubcategory;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};
// ==========================================
// DEACTIVATE PRODUCT - ADMIN ONLY
// ==========================================
const deactivateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    product.isActive = false;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE VARIANT STOCK - ADMIN ONLY
// ==========================================
const updateVariantStock = async (req, res, next) => {
  try {
    const { variantId, size, stock } = req.body;

    if (
      !variantId ||
      size === undefined ||
      stock === undefined
    ) {
      res.status(400);
      throw new Error(
        "Variant ID, size and stock are required"
      );
    }

    if (Number(stock) < 0) {
      res.status(400);
      throw new Error("Stock cannot be negative");
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
      res.status(404);
      throw new Error("Product variant not found");
    }

    const sizeItem = variant.sizes.find(
      (item) => String(item.size) === String(size)
    );

    if (!sizeItem) {
      res.status(404);
      throw new Error("Size not found");
    }

    sizeItem.stock = Number(stock);

    await product.save();

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE VARIANT PRICE - ADMIN ONLY
// ==========================================
const updateVariantPrice = async (req, res, next) => {
  try {
    const {
      variantId,
      mrp,
      sellingPrice,
      discount,
    } = req.body;

    if (!variantId) {
      res.status(400);
      throw new Error("Variant ID is required");
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
      res.status(404);
      throw new Error("Product variant not found");
    }

    if (mrp !== undefined) {
      if (Number(mrp) < 0) {
        res.status(400);
        throw new Error("MRP cannot be negative");
      }

      variant.mrp = Number(mrp);
    }

    if (sellingPrice !== undefined) {
      if (Number(sellingPrice) < 0) {
        res.status(400);
        throw new Error(
          "Selling price cannot be negative"
        );
      }

      variant.sellingPrice = Number(sellingPrice);
    }

    if (discount !== undefined) {
      if (
        Number(discount) < 0 ||
        Number(discount) > 100
      ) {
        res.status(400);
        throw new Error(
          "Discount must be between 0 and 100"
        );
      }

      variant.discount = Number(discount);
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Price updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
  updateVariantStock,
  updateVariantPrice,
};