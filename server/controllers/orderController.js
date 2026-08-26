const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
// const razorpay = require("../config/razorpay");

// ==========================================
// HELPER: FIND PRODUCT VARIANT BY COLOR
// ==========================================
const findVariant = (product, color) => {
  return product.variants.find(
    (variant) =>
      variant.color.toLowerCase() === color.toLowerCase()
  );
};

// ==========================================
// PLACE ORDER - USER ONLY
// ==========================================
const placeOrder = async (req, res, next) => {
  try {
    const { addressId, paymentMethod } = req.body;

    // 1. Validate payment method
    if (!["cod", "online"].includes(paymentMethod)) {
      res.status(400);
      throw new Error("Invalid payment method");
    }

    // 2. Get user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("user");

    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error("Your cart is empty");
    }

    // 3. Find selected saved address
    const selectedAddress =
      cart.user.addresses.id(addressId);

    if (!selectedAddress) {
      res.status(404);
      throw new Error(
        "Selected delivery address not found"
      );
    }

    const orderItems = [];
    let subtotal = 0;

    // 4. Validate every cart item
    for (const cartItem of cart.items) {
      const product = await Product.findById(
        cartItem.product
      );

      if (!product || !product.isActive) {
        res.status(400);
        throw new Error(
          "One or more products are no longer available"
        );
      }

      const variant = findVariant(
        product,
        cartItem.color
      );

      if (!variant) {
        res.status(400);
        throw new Error(
          `${product.name} color is no longer available`
        );
      }

      const sizeItem = variant.sizes.find(
        (item) =>
          String(item.size) ===
          String(cartItem.size)
      );

      if (!sizeItem) {
        res.status(400);
        throw new Error(
          `${product.name} selected size is no longer available`
        );
      }

      // Check latest stock from database
      if (sizeItem.stock < cartItem.quantity) {
        res.status(400);
        throw new Error(
          `Only ${sizeItem.stock} item(s) available for ${product.name}, size ${cartItem.size}, color ${cartItem.color}`
        );
      }

      // Use latest product price from database
      const itemPrice = variant.sellingPrice;

      // Get first image of selected color
      const itemImage =
        variant.images.length > 0
          ? variant.images[0].url
          : "";

      orderItems.push({
        product: product._id,
        name: product.name,
        image: itemImage,
        color: cartItem.color,
        size: cartItem.size,
        quantity: cartItem.quantity,
        price: itemPrice,
      });

      subtotal +=
        itemPrice * cartItem.quantity;

      // Reduce stock
      sizeItem.stock -= cartItem.quantity;

      // Increase total sold
      product.totalSold += cartItem.quantity;

      await product.save();
    }

    // 5. Shipping fee for now
    const shippingFee = 0;

    const totalAmount =
      subtotal + shippingFee;

    // 6. Create order
    const order = await Order.create({
      user: req.user._id,

      items: orderItems,

      deliveryAddress: {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        addressLine1:
          selectedAddress.addressLine1,
        addressLine2:
          selectedAddress.addressLine2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        country: selectedAddress.country,
      },

      paymentMethod,

      paymentStatus: "pending",

      orderStatus: "pending",

      subtotal,
      shippingFee,
      totalAmount,
    });

    // 7. Clear cart after successful order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET MY ORDERS - USER ONLY
// ==========================================
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET SINGLE ORDER - USER ONLY
// ==========================================
const getMyOrderById = async (
  req,
  res,
  next
) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL ORDERS - ADMIN ONLY
// ==========================================
const getAllOrders = async (
  req,
  res,
  next
) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email phone gender"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE ORDER STATUS - ADMIN ONLY
// ==========================================
const updateOrderStatus = async (
  req,
  res,
  next
) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "packed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    // 1. Validate status
    if (
      !allowedStatuses.includes(
        orderStatus
      )
    ) {
      res.status(400);
      throw new Error("Invalid order status");
    }

    // 2. Find order
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // 3. Prevent same status update
    if (order.orderStatus === orderStatus) {
      res.status(400);
      throw new Error(
        `This order is already ${orderStatus}`
      );
    }

    // 4. Define allowed status transitions
    const statusFlow = {
      pending: [
        "confirmed",
        "cancelled",
      ],

      confirmed: [
        "packed",
        "cancelled",
      ],

      packed: [
        "shipped",
        "cancelled",
      ],

      shipped: ["delivered"],

      delivered: [],

      cancelled: [],
    };

    // 5. Check status transition
    if (
      !statusFlow[
        order.orderStatus
      ].includes(orderStatus)
    ) {
      res.status(400);
      throw new Error(
        `Cannot change order status from ${order.orderStatus} to ${orderStatus}`
      );
    }

    // 6. Restore stock if cancelled
    if (orderStatus === "cancelled") {
      for (const orderItem of order.items) {
        const product =
          await Product.findById(
            orderItem.product
          );

        if (!product) continue;

        const variant = findVariant(
          product,
          orderItem.color
        );

        if (!variant) continue;

        const sizeItem =
          variant.sizes.find(
            (item) =>
              String(item.size) ===
              String(orderItem.size)
          );

        if (sizeItem) {
          // Restore stock
          sizeItem.stock +=
            orderItem.quantity;

          // Reduce total sold safely
          product.totalSold = Math.max(
            0,
            product.totalSold -
              orderItem.quantity
          );

          await product.save();
        }
      }
    }

    // 7. Update order status
    order.orderStatus = orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CANCEL MY ORDER - USER ONLY
// ==========================================
const cancelMyOrder = async (
  req,
  res,
  next
) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // User CAN cancel:
    // pending, confirmed, packed
    //
    // User CANNOT cancel:
    // shipped, delivered, cancelled
    if (
      [
        "shipped",
        "delivered",
        "cancelled",
      ].includes(order.orderStatus)
    ) {
      res.status(400);
      throw new Error(
        `Cannot cancel an order with status: ${order.orderStatus}`
      );
    }

    // Restore stock
    for (const orderItem of order.items) {
      const product =
        await Product.findById(
          orderItem.product
        );

      if (!product) continue;

      const variant = findVariant(
        product,
        orderItem.color
      );

      if (!variant) continue;

      const sizeItem =
        variant.sizes.find(
          (item) =>
            String(item.size) ===
            String(orderItem.size)
        );

      if (sizeItem) {
        // Restore stock
        sizeItem.stock +=
          orderItem.quantity;

        // Reduce total sold
        product.totalSold = Math.max(
          0,
          product.totalSold -
            orderItem.quantity
        );

        await product.save();
      }
    }

    // Update order
    order.orderStatus = "cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder,
};