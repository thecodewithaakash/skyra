import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../config/config.js";
import fileUpload, { deleteFile } from "../services/imagekit.service.js";

export function createAccessToken({ id, role }) {
  return jwt.sign({ id, role }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "15Min",
  });
}

export function createRefreshToken({ id, role }) {
  return jwt.sign({ id, role }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "7Days",
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
}

export const uploadProductImages = async (files = []) => {
  const results = await Promise.allSettled(
    files.map(async (file) => {
      const response = await fileUpload({
        buffer: file.buffer,
        fileName: file.originalname,
      });

      return { fileId: response.fileId, url: response.url };
    }),
  );

  const uploadedImages = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
  const failedUpload = results.find((result) => result.status === "rejected");

  if (failedUpload) {
    await removeProductImages(uploadedImages);
    throw failedUpload.reason;
  }

  return uploadedImages;
};

export const removeProductImages = (images = []) =>
  Promise.allSettled(
    (images || [])
      .filter((image) => image.fileId)
      .map(({ fileId }) => deleteFile({ fileId })),
  );

export const isValidProductId = (id) => mongoose.isValidObjectId(id);

export const isProductOwner = (product, userId) =>
  String(product.sellerId) === String(userId);
