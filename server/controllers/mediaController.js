const cloudinary = require("../config/cloudinary");

// ==========================================
// UPLOAD MEDIA TO CLOUDINARY
// ==========================================
const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please select an image to upload");
    }

    const folder =
      req.body.folder ||
      "popular-footwear/media";

    const result = await new Promise(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: "image",
            },
            (error, uploadedFile) => {
              if (error) {
                reject(error);
                return;
              }

              resolve(uploadedFile);
            }
          );

        uploadStream.end(req.file.buffer);
      }
    );

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",

      media: {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE MEDIA FROM CLOUDINARY
// ==========================================
const deleteMedia = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      res.status(400);
      throw new Error(
        "Cloudinary public ID is required"
      );
    }

    const result =
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image",
        }
      );

    if (
      result.result !== "ok" &&
      result.result !== "not found"
    ) {
      res.status(400);
      throw new Error(
        "Unable to delete image from Cloudinary"
      );
    }

    res.status(200).json({
      success: true,
      message:
        result.result === "not found"
          ? "Image was already removed"
          : "Image deleted successfully",
      result: result.result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadMedia,
  deleteMedia,
};