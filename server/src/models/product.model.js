import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minLength: 3, maxLength: 50 },
    description: {
      type: String,
      required: true,
      minLength: 50,
      maxLength: 150,
    },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, enum: ["INR", "USD"], default: "INR" },
    },
    sizes: [
      {
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
          required: true,
        },
        stock: {
          type: Number,
          min: 0,
          default: 0,
        },
      },
    ],
    images: {
      type: [
        {
          fileId: { type: String },
          url: { type: String },
        },
      ],
      validate: {
        validator: (images) => images.length <= 5,
        message: "A product can have 5 images at most",
      },
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      index: true,
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("products", productSchema);
export default productModel;
