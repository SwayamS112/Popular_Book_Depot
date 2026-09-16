const mongoose = require("mongoose");

const homeSectionSchema = new mongoose.Schema(
  {
    /* =========================================================
       SECTION IDENTIFICATION
    ========================================================= */

    sectionKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /* =========================================================
       MAIN SECTION CONTENT
       
       Used by:
       - Popular Collections
       - Shop By Category
       - Every Moment
    ========================================================= */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    /* =========================================================
       MAIN / COLLECTION IMAGE

       Existing Popular Collection functionality uses this.
       DO NOT REMOVE.
    ========================================================= */

    image: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },

    /* =========================================================
       MAIN BUTTON

       Existing Popular Collection functionality uses this.
    ========================================================= */

    buttonText: {
      type: String,
      default: "Explore",
      trim: true,
    },

    buttonLink: {
      type: String,
      default: "",
      trim: true,
    },

    /* =========================================================
       PRODUCTS

       Existing Popular Collection functionality uses this.
    ========================================================= */

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    /* =========================================================
       POSTER / CARD ITEMS

       Used by:

       1. Shop By Category
          - Men
          - Women
          - Kids
          - Accessories

       2. Every Moment
          - College
          - Work
          - Travel
          - Play

       Existing collection documents can simply have:
       items: []
    ========================================================= */

    items: [
      {
        key: {
          type: String,
          trim: true,
        },

        title: {
          type: String,
          trim: true,
        },

        subtitle: {
          type: String,
          default: "",
          trim: true,
        },

        image: {
          url: {
            type: String,
            default: "",
          },

          publicId: {
            type: String,
            default: "",
          },
        },

        buttonText: {
          type: String,
          default: "",
          trim: true,
        },

        buttonLink: {
          type: String,
          default: "",
          trim: true,
        },

        order: {
          type: Number,
          default: 0,
        },

        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    /* =========================================================
       DISPLAY ORDER
    ========================================================= */

    order: {
      type: Number,
      default: 0,
    },

    /* =========================================================
       SECTION VISIBILITY
    ========================================================= */

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const HomeSection = mongoose.model(
  "HomeSection",
  homeSectionSchema
);

module.exports = HomeSection;