const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const homeSectionRoutes = require("./routes/homeSectionRoutes");  
const kidsSizeGuideRoutes = require("./routes/kidsSizeGuideRoutes");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Popular Footwear API is running",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/home-sections", homeSectionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/kids-size-guide", kidsSizeGuideRoutes);

app.use(notFound);
app.use(errorHandler);


module.exports = app;



// ADMIN_TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBiZC5zdWphbnB1ckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3ODczMjE3MDYsImV4cCI6MTc4NzkyNjUwNn0.-4kTYmjQhBmpnXjguOtCKzE9GTzLGKNm6vgspbOlBP0'