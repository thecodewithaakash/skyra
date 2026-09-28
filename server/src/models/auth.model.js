import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 50 },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "seller"], default: "user" },
    refreshToken: String,
  },
  { timestamps: true },
);

const authModel = mongoose.model("users", userSchema);
export default authModel;
