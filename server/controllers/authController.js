const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ===============================
// CUSTOMER SIGNUP
// ===============================

const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      gender,
      phone,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !gender ||
      !phone
    ) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Prevent normal users from registering with admin email
    if (
      normalizedEmail ===
      process.env.ADMIN_EMAIL.toLowerCase().trim()
    ) {
      res.status(403);
      throw new Error("This email cannot be used for registration");
    }

    const userExists = await User.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      gender,
      phone,
      role: "customer",
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
      }),
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// LOGIN
// ===============================

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ==========================================
    // ADMIN LOGIN FROM ENV
    // ==========================================

    const isAdminEmail =
      normalizedEmail ===
      process.env.ADMIN_EMAIL.toLowerCase().trim();

    const isAdminPassword =
      password === process.env.ADMIN_PASSWORD;

    if (isAdminEmail && isAdminPassword) {
      const admin = {
        id: "admin",
        name: "Administrator",
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      };

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        user: admin,
        token: generateToken(admin),
      });
    }

    // ==========================================
    // CUSTOMER LOGIN
    // ==========================================

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
      }),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};