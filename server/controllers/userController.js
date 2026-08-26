const User = require("../models/User");

// ===============================
// GET MY PROFILE
// ===============================
const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// UPDATE MY PROFILE
// ===============================
const updateMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const { name, phone, gender } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// ADD ADDRESS
// ===============================
const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !pincode
    ) {
      res.status(400);
      throw new Error("Please fill in all required address fields");
    }

    // First address automatically becomes default
    const isFirstAddress = user.addresses.length === 0;

    user.addresses.push({
      fullName,
      phone,
      addressLine1,
      addressLine2: addressLine2 || "",
      city,
      state,
      pincode,
      country: country || "India",
      isDefault: isFirstAddress,
    });

    await user.save();

    const newAddress =
      user.addresses[user.addresses.length - 1];

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// UPDATE ADDRESS
// ===============================
const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      res.status(404);
      throw new Error("Address not found");
    }

    const fields = [
      "fullName",
      "phone",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "pincode",
      "country",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        address[field] = req.body[field];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// DELETE ADDRESS
// ===============================
const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      res.status(404);
      throw new Error("Address not found");
    }

    const wasDefault = address.isDefault;

    address.deleteOne();

    // If deleted address was default,
    // make the first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// SET DEFAULT ADDRESS
// ===============================
const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const selectedAddress =
      user.addresses.id(req.params.addressId);

    if (!selectedAddress) {
      res.status(404);
      throw new Error("Address not found");
    }

    user.addresses.forEach((address) => {
      address.isDefault =
        address._id.toString() ===
        req.params.addressId;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};