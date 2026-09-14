const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ==========================================
// ADMIN LOGIN
// ==========================================
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      res.status(401);
      throw new Error("Invalid admin email or password");
    }

    const token = jwt.sign(
      {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================
const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalCustomers,
      totalOrders,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments(),

      Product.countDocuments({
        isActive: true,
      }),

      Product.countDocuments({
        isActive: false,
      }),

      User.countDocuments({
        role: "customer",
      }),

      Order.countDocuments(),

      Order.find()
        .populate({
          path: "user",
          select: "name email phone",
        })
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .lean(),
    ]);

    // Cancelled orders should not contribute to revenue.
    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // Count orders by their current status.
    const orderStatusResult = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const ordersByStatus = {
      pending: 0,
      confirmed: 0,
      packed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orderStatusResult.forEach((item) => {
      if (
        Object.prototype.hasOwnProperty.call(
          ordersByStatus,
          item._id
        )
      ) {
        ordersByStatus[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,

      admin: req.admin,

      stats: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        totalCustomers,
        totalOrders,
        totalRevenue,
      },

      ordersByStatus,

      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ADMIN CUSTOMERS
// ==========================================
// Returns customer list with order statistics.
// Supports:
// ?search=
// ?status=active
// ?status=inactive
// ==========================================
const getAdminCustomers = async (req, res, next) => {
  try {
    const { search = "", status = "all" } = req.query;

    const userFilter = {
      role: "customer",
    };

    // ------------------------------------------
    // Status filter
    // ------------------------------------------
    if (status === "active") {
      userFilter.isActive = true;
    }

    if (status === "inactive") {
      userFilter.isActive = false;
    }

    // ------------------------------------------
    // Search
    // ------------------------------------------
    if (search.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      userFilter.$or = [
        {
          name: searchRegex,
        },
        {
          email: searchRegex,
        },
        {
          phone: searchRegex,
        },
      ];
    }

    const customers = await User.find(userFilter)
      .select("-password")
      .sort({
        createdAt: -1,
      })
      .lean();

    if (customers.length === 0) {
      return res.status(200).json({
        success: true,
        customers: [],
      });
    }

    const customerIds = customers.map(
      (customer) => customer._id
    );

    // ------------------------------------------
    // Order statistics for each customer
    // ------------------------------------------
    const orderStats = await Order.aggregate([
      {
        $match: {
          user: {
            $in: customerIds,
          },
        },
      },
      {
        $group: {
          _id: "$user",

          totalOrders: {
            $sum: 1,
          },

          totalSpent: {
            $sum: {
              $cond: [
                {
                  $ne: ["$orderStatus", "cancelled"],
                },
                "$totalAmount",
                0,
              ],
            },
          },
        },
      },
    ]);

    const statsMap = new Map();

    orderStats.forEach((item) => {
      statsMap.set(item._id.toString(), {
        totalOrders: item.totalOrders,
        totalSpent: item.totalSpent,
      });
    });

    // ------------------------------------------
    // Combine customer + order statistics
    // ------------------------------------------
    const formattedCustomers = customers.map((customer) => {
      const stats = statsMap.get(
        customer._id.toString()
      ) || {
        totalOrders: 0,
        totalSpent: 0,
      };

      return {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        gender: customer.gender,
        role: customer.role,
        isActive: customer.isActive,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,

        totalOrders: stats.totalOrders,
        totalSpent: stats.totalSpent,
      };
    });

    res.status(200).json({
      success: true,
      customers: formattedCustomers,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ADMIN CUSTOMER DETAILS
// ==========================================
const getAdminCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await User.findOne({
      _id: id,
      role: "customer",
    })
      .select("-password")
      .lean();

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    const orders = await Order.find({
      user: customer._id,
    })
      .populate({
        path: "items.product",
        select: "name brand",
      })
      .sort({
        createdAt: -1,
      })
      .lean();

    const validOrders = orders.filter(
      (order) => order.orderStatus !== "cancelled"
    );

    const totalSpent = validOrders.reduce(
      (total, order) => total + (order.totalAmount || 0),
      0
    );

    res.status(200).json({
      success: true,

      customer: {
        ...customer,

        totalOrders: orders.length,

        completedOrders: validOrders.length,

        totalSpent,

        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ACTIVATE / DEACTIVATE CUSTOMER
// ==========================================
const updateCustomerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      res.status(400);
      throw new Error(
        "isActive must be a boolean value"
      );
    }

    const customer = await User.findOne({
      _id: id,
      role: "customer",
    });

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    customer.isActive = isActive;

    await customer.save();

    res.status(200).json({
      success: true,
      message: isActive
        ? "Customer activated successfully"
        : "Customer deactivated successfully",

      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        isActive: customer.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin,
  getAdminDashboard,
  getAdminCustomers,
  getAdminCustomerById,
  updateCustomerStatus,
};