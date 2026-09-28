import productModel from "../models/product.model.js";
import {
  isProductOwner,
  isValidProductId,
  removeProductImages,
  uploadProductImages,
} from "../utils/utils.js";

export const addProduct = async (req, res) => {
  let uploadedImages = [];

  try {
    const { title, description, price, sizes } = req.body;
    uploadedImages = await uploadProductImages(req.files);
    const product = await productModel.create({
      sellerId: req.user.id,
      title,
      description,
      price,
      sizes,
      images: uploadedImages,
    });

    return res.status(201).json({
      message: "Product added successfully",
      data: { product },
    });
  } catch (error) {
    await removeProductImages(uploadedImages);
    return res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).json({
      message: "Products fetched successfully",
      data: { products },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch all products",
      error: error.message,
    });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ sellerId: req.user.id })
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    return res.status(200).json({
      message: "Seller products fetched successfully",
      data: { products },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch seller products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidProductId(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      data: { product },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch product by given Id",
      error: error.message,
    });
  }
};

export const updatebyId = async (req, res) => {
  let uploadedImages = [];
  let productSaved = false;

  try {
    const { id } = req.params;
    const { title, description, price, sizes } = req.body;

    if (!isValidProductId(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!isProductOwner(product, req.user.id)) {
      return res
        .status(403)
        .json({ message: "You cannot update this product" });
    }

    const previousImages = product.images;
    uploadedImages = await uploadProductImages(req.files);

    product.title = title;
    product.description = description;
    product.price = price;
    product.sizes = sizes;
    if (uploadedImages.length > 0) {
      product.images = uploadedImages;
    }

    const updatedProduct = await product.save();
    productSaved = true;

    if (uploadedImages.length > 0) {
      await removeProductImages(previousImages);
    }

    return res.status(200).json({
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    if (!productSaved) {
      await removeProductImages(uploadedImages);
    }
    return res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};


export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidProductId(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!isProductOwner(product, req.user.id)) {
      return res
        .status(403)
        .json({ message: "You cannot delete this product" });
    }

    await productModel.findByIdAndDelete(id);
    await removeProductImages(product.images);

    return res.status(200).json({
      message: "Product deleted successfully",
      data: { product },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
