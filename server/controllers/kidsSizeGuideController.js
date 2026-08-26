const KidsSizeGuide = require(
  "../models/KidsSizeGuide"
);

// ==========================================
// GET KIDS SIZE GUIDE - PUBLIC
// ==========================================
const getKidsSizeGuide = async (req, res, next) => {
  try {
    let guide = await KidsSizeGuide.findOne({
      isActive: true,
    });

    if (!guide) {
      guide = await KidsSizeGuide.create({});
    }

    res.status(200).json({
      success: true,
      guide,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE KIDS SIZE GUIDE - ADMIN ONLY
// ==========================================
const updateKidsSizeGuide = async (
  req,
  res,
  next
) => {
  try {
    const {
      title,
      disclaimer,
      rows,
      isActive,
    } = req.body;

    let guide = await KidsSizeGuide.findOne();

    if (!guide) {
      guide = await KidsSizeGuide.create({
        title,
        disclaimer,
        rows,
        isActive,
      });
    } else {
      if (title !== undefined) {
        guide.title = title;
      }

      if (disclaimer !== undefined) {
        guide.disclaimer = disclaimer;
      }

      if (rows !== undefined) {
        guide.rows = rows;
      }

      if (isActive !== undefined) {
        guide.isActive = isActive;
      }

      await guide.save();
    }

    res.status(200).json({
      success: true,
      message:
        "Kids size guide updated successfully",
      guide,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKidsSizeGuide,
  updateKidsSizeGuide,
};