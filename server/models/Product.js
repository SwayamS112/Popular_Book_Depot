const mongoose = require("mongoose");

const sizeStockSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    sizes: [sizeStockSchema],

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    _id: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    // Basic product information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    // Main section
    section: {
      type: String,
      required: true,
      enum: ["men", "women", "kids", "accessories"],
    },

    // Example: shoes / accessories
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Example:
    // sports-shoes
    // formal-shoes
    // sneakers
    // sandals
    // home-slippers
    // heels
    // school-shoes
    // general
    subcategory: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Different colours, images, sizes and prices
    variants: {
      type: [variantSchema],
      required: true,

      validate: {
        validator: function (variants) {
          return variants && variants.length > 0;
        },

        message: "At least one product variant is required",
      },
    },

    // Return information
    returnPolicy: {
      type: String,
      enum: [
        "returnable",
        "exchange_only",
        "non_returnable",
      ],
      default: "returnable",
    },

    returnNote: {
      type: String,
      default: "",
      trim: true,
    },

    // Product status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Homepage / special collection flags
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: true,
    },

    // For future automatic best seller calculation
    totalSold: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model(
  "Product",
  productSchema
);

module.exports = Product;