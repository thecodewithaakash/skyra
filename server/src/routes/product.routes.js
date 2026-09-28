import { Router } from "express";
import multer from "multer";
import { productValidator } from "../validators/product.validator.js";
import {
  addProduct,
  deleteById,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updatebyId,
} from "../controllers/product.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024, // max 1 MB per file
    files: 5, // max 5 files per request
  },
});

const router = Router();

const requireSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Seller access required" });
  }
  next();
};

const parseProductFields = (req, res, next) => {
  try {
    for (const field of ["price", "sizes"]) {
      if (typeof req.body[field] === "string") {
        req.body[field] = JSON.parse(req.body[field]);
      }
    }
    next();
  } catch {
    return res.status(400).json({
      message: "Price and sizes must contain valid JSON",
    });
  }
};

router.get("/mine", authenticate, requireSeller, getSellerProducts);

router.post(
  "/",
  authenticate,
  requireSeller,
  upload.array("images"),
  parseProductFields,
  productValidator,
  addProduct,
);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete(
  "/:id",
  authenticate,
  requireSeller,
  deleteById,
);
router.put(
  "/:id",
  authenticate,
  requireSeller,
  upload.array("images"),
  parseProductFields,
  productValidator,
  updatebyId,
);

export default router;
