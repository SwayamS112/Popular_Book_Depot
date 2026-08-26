const mongoose = require("mongoose");

const sizeGuideRowSchema = new mongoose.Schema(
  {
    ageRange: {
      type: String,
      required: true,
      trim: true,
    },

    footLength: {
      type: String,
      required: true,
      trim: true,
    },

    recommendedSize: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: true,
  }
);

const kidsSizeGuideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Kids Age to Size Guide",
      trim: true,
    },

    disclaimer: {
      type: String,
      default:
        "The sizes shown in this guide are for general reference only. Shoe sizes may vary between different brands and manufacturers. For the best fit, we recommend checking the product's specific size information and measuring the child's foot before purchasing.",
      trim: true,
    },

    rows: {
      type: [sizeGuideRowSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "KidsSizeGuide",
  kidsSizeGuideSchema
);