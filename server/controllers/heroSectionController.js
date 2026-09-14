const HeroSection = require("../models/HeroSection");

/*
=========================================================
PUBLIC
GET ACTIVE HERO SECTION
=========================================================
*/

const getHeroSection = async (req, res, next) => {
  try {
    let hero = await HeroSection.findOne({
      isActive: true,
    }).lean();

    /*
    If no Hero document exists yet, create the default one.
    This means the customer homepage will not suddenly break
    while the admin CMS is being configured.
    */

    if (!hero) {
      hero = await HeroSection.create({
        badge: "FOOTWEAR FOR EVERY STEP",

        title: "STEP INTO",

        highlight: "STYLE.",

        description:
          "From everyday comfort to statement-making style, discover footwear designed for every journey, every occasion and every step.",

        primaryButton: {
          text: "SHOP MEN",
          link: "/products/men",
        },

        secondaryButton: {
          text: "SHOP WOMEN",
          link: "/products/women",
        },

        trustTitle: "50+ Years of Trust",

        trustDescription:
          "Serving generations with quality, comfort and customer belief.",

        stats: [
          {
            value: "50+",
            label: "Years of Trust",
          },
          {
            value: "10K+",
            label: "Happy Customers",
          },
          {
            value: "Premium",
            label: "Quality Footwear",
          },
        ],

        isActive: true,
      });

      hero = hero.toObject();
    }

    res.status(200).json({
      success: true,
      hero,
    });
  } catch (error) {
    next(error);
  }
};

/*
=========================================================
ADMIN
GET HERO SECTION
=========================================================
*/

const getAdminHeroSection = async (req, res, next) => {
  try {
    let hero = await HeroSection.findOne().lean();

    if (!hero) {
      hero = await HeroSection.create({
        badge: "FOOTWEAR FOR EVERY STEP",

        title: "STEP INTO",

        highlight: "STYLE.",

        description:
          "From everyday comfort to statement-making style, discover footwear designed for every journey, every occasion and every step.",

        primaryButton: {
          text: "SHOP MEN",
          link: "/products/men",
        },

        secondaryButton: {
          text: "SHOP WOMEN",
          link: "/products/women",
        },

        trustTitle: "50+ Years of Trust",

        trustDescription:
          "Serving generations with quality, comfort and customer belief.",

        stats: [
          {
            value: "50+",
            label: "Years of Trust",
          },
          {
            value: "10K+",
            label: "Happy Customers",
          },
          {
            value: "Premium",
            label: "Quality Footwear",
          },
        ],

        isActive: true,
      });

      hero = hero.toObject();
    }

    res.status(200).json({
      success: true,
      hero,
    });
  } catch (error) {
    next(error);
  }
};

/*
=========================================================
ADMIN
UPDATE HERO SECTION
=========================================================
*/

const updateHeroSection = async (req, res, next) => {
  try {
    let hero = await HeroSection.findOne();

    if (!hero) {
      hero = new HeroSection();
    }

    const allowedFields = [
      "badge",
      "title",
      "highlight",
      "description",
      "primaryButton",
      "secondaryButton",
      "trustTitle",
      "trustDescription",
      "stats",
      "heroImage",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        hero[field] = req.body[field];
      }
    });

    await hero.save();

    res.status(200).json({
      success: true,
      message: "Hero section updated successfully.",
      hero,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHeroSection,
  getAdminHeroSection,
  updateHeroSection,
};