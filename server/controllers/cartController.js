const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ===============================
// HELPER: GET STOCK FOR VARIANT
// ===============================
const getVariantStock = (product, color, size) => {
  const selectedVariant = product.variants.find(
    (variant) =>
      variant.color.toLowerCase() === color.toLowerCase()
  );

  if (!selectedVariant) {
    return null;
  }

  const selectedSize = selectedVariant.sizes.find(
    (item) => String(item.size) === String(size)
  );

  if (!selectedSize) {
    return null;
  }

  return selectedSize.stock;
};

// ===============================
// GET MY CART
// ===============================
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    // If user has never added anything,
    // return an empty cart
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// ADD TO CART
// ===============================
const addToCart = async (req, res, next) => {
  try {
    const {
      productId,
      color,
      size,
      quantity = 1,
    } = req.body;

    if (!productId || !color || !size) {
      res.status(400);
      throw new Error(
        "Product, color and size are required"
      );
    }

    if (Number(quantity) < 1) {
      res.status(400);
      throw new Error(
        "Quantity must be at least 1"
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (!product.isActive) {
      res.status(400);
      throw new Error(
        "This product is currently unavailable"
      );
    }

    const availableStock = getVariantStock(
      product,
      color,
      size
    );

    if (availableStock === null) {
      res.status(400);
      throw new Error(
        "Selected color or size is not available"
      );
    }

    if (availableStock <= 0) {
      res.status(400);
      throw new Error(
        "This product variant is out of stock"
      );
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.color.toLowerCase() === color.toLowerCase() &&
        String(item.size) === String(size)
    );

    const requestedQuantity = Number(quantity);

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + requestedQuantity;

      if (newQuantity > availableStock) {
        res.status(400);
        throw new Error(
          `Only ${availableStock} items available in stock`
        );
      }

      existingItem.quantity = newQuantity;
    } else {
      if (requestedQuantity > availableStock) {
        res.status(400);
        throw new Error(
          `Only ${availableStock} items available in stock`
        );
      }

      cart.items.push({
        product: productId,
        color,
        size,
        quantity: requestedQuantity,
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(
      cart._id
    ).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// UPDATE CART ITEM QUANTITY
// ===============================
const updateCartQuantity = async (
  req,
  res,
  next
) => {
  try {
    const { quantity } = req.body;

    if (!quantity || Number(quantity) < 1) {
      res.status(400);
      throw new Error(
        "Quantity must be at least 1"
      );
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    const cartItem = cart.items.id(
      req.params.itemId
    );

    if (!cartItem) {
      res.status(404);
      throw new Error("Cart item not found");
    }

    const product = await Product.findById(
      cartItem.product
    );

    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(
        "This product is no longer available"
      );
    }

    const availableStock = getVariantStock(
      product,
      cartItem.color,
      cartItem.size
    );

    if (
      availableStock === null ||
      availableStock <= 0
    ) {
      res.status(400);
      throw new Error(
        "This product variant is out of stock"
      );
    }

    if (Number(quantity) > availableStock) {
      res.status(400);
      throw new Error(
        `Only ${availableStock} items available in stock`
      );
    }

    cartItem.quantity = Number(quantity);

    await cart.save();

    const updatedCart = await Cart.findById(
      cart._id
    ).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// REMOVE CART ITEM
// ===============================
const removeCartItem = async (
  req,
  res,
  next
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    const cartItem = cart.items.id(
      req.params.itemId
    );

    if (!cartItem) {
      res.status(404);
      throw new Error("Cart item not found");
    }

    cartItem.deleteOne();

    await cart.save();

    const updatedCart = await Cart.findById(
      cart._id
    ).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// MERGE GUEST CART
// ===============================
const mergeGuestCart = async (
  req,
  res,
  next
) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400);
      throw new Error("Cart items must be an array");
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    for (const guestItem of items) {
      const {
        productId,
        color,
        size,
        quantity,
      } = guestItem;

      if (!productId || !color || !size) {
        continue;
      }

      const product = await Product.findById(
        productId
      );

      if (!product || !product.isActive) {
        continue;
      }

      const availableStock = getVariantStock(
        product,
        color,
        size
      );

      if (
        availableStock === null ||
        availableStock <= 0
      ) {
        continue;
      }

      const requestedQuantity =
        Math.max(1, Number(quantity) || 1);

      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === productId &&
          item.color.toLowerCase() ===
            color.toLowerCase() &&
          String(item.size) === String(size)
      );

      if (existingItem) {
        // Same item already exists:
        // add quantities, but never exceed stock
        existingItem.quantity = Math.min(
          existingItem.quantity +
            requestedQuantity,
          availableStock
        );
      } else {
        cart.items.push({
          product: productId,
          color,
          size,
          quantity: Math.min(
            requestedQuantity,
            availableStock
          ),
        });
      }
    }

    await cart.save();

    const updatedCart = await Cart.findById(
      cart._id
    ).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Guest cart merged successfully",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeCartItem,
  mergeGuestCart,
};