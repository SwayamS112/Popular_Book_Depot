const jwt = require("jsonwebtoken");

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

module.exports = {
  adminLogin,
};