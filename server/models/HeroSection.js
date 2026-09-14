const mongoose = require("mongoose");

const heroSectionSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      default: "FOOTWEAR FOR EVERY STEP",
      trim: true,
    },

    title: {
      type: String,
      default: "STEP INTO",
      trim: true,
    },

    highlight: {
      type: String,
      default: "STYLE.",
      trim: true,
    },

    description: {
      type: String,
      default:
        "From everyday comfort to statement-making style, discover footwear designed for every journey, every occasion and every step.",
      trim: true,
    },

    primaryButton: {
      text: {
        type: String,
        default: "SHOP MEN",
        trim: true,
      },
      link: {
        type: String,
        default: "/products/men",
        trim: true,
      },
    },

    secondaryButton: {
      text: {
        type: String,
        default: "SHOP WOMEN",
        trim: true,
      },
      link: {
        type: String,
        default: "/products/women",
        trim: true,
      },
    },

    trustTitle: {
      type: String,
      default: "50+ Years of Trust",
      trim: true,
    },

    trustDescription: {
      type: String,
      default:
        "Serving generations with quality, comfort and customer belief.",
      trim: true,
    },

    stats: [
      {
        value: {
          type: String,
          trim: true,
        },
        label: {
          type: String,
          trim: true,
        },
      },
    ],

    heroImage: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
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

const HeroSection = mongoose.model("HeroSection", heroSectionSchema);

module.exports = HeroSection;