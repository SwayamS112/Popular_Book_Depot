const HomeSection = require("../models/HomeSection");

// ==========================================
// GET ALL ACTIVE HOME SECTIONS - PUBLIC
// ==========================================
const getHomeSections = async (req, res, next) => {
  try {
    const sections = await HomeSection.find({
      isActive: true,
    })
      .populate({
        path: "products",
        match: { isActive: true },
      })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: sections.length,
      sections,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL HOME SECTIONS - ADMIN
// ==========================================
const getAllHomeSectionsAdmin = async (
  req,
  res,
  next
) => {
  try {
    const sections = await HomeSection.find()
      .populate("products")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: sections.length,
      sections,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CREATE HOME SECTION - ADMIN
// ==========================================
const createHomeSection = async (req, res, next) => {
  try {
    const {
      sectionKey,
      title,
      subtitle,
      image,
      buttonText,
      buttonLink,
      products,
      order,
      isActive,
    } = req.body;

    if (!sectionKey || !title) {
      res.status(400);
      throw new Error(
        "Section key and title are required"
      );
    }

    const existingSection =
      await HomeSection.findOne({ sectionKey });

    if (existingSection) {
      res.status(400);
      throw new Error(
        "A home section with this key already exists"
      );
    }

    const section = await HomeSection.create({
      sectionKey,
      title,
      subtitle,
      image,
      buttonText,
      buttonLink,
      products: products || [],
      order: order !== undefined ? order : 0,
      isActive:
        isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Home section created successfully",
      section,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE HOME SECTION - ADMIN
// ==========================================
const updateHomeSection = async (req, res, next) => {
  try {
    const section = await HomeSection.findById(
      req.params.id
    );

    if (!section) {
      res.status(404);
      throw new Error("Home section not found");
    }

    const allowedFields = [
      "title",
      "subtitle",
      "image",
      "buttonText",
      "buttonLink",
      "products",
      "order",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        section[field] = req.body[field];
      }
    });

    const updatedSection = await section.save();

    res.status(200).json({
      success: true,
      message: "Home section updated successfully",
      section: updatedSection,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE HOME SECTION - ADMIN
// ==========================================
const deleteHomeSection = async (req, res, next) => {
  try {
    const section = await HomeSection.findById(
      req.params.id
    );

    if (!section) {
      res.status(404);
      throw new Error("Home section not found");
    }

    await section.deleteOne();

    res.status(200).json({
      success: true,
      message: "Home section deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHomeSections,
  getAllHomeSectionsAdmin,
  createHomeSection,
  updateHomeSection,
  deleteHomeSection,
};