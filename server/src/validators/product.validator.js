import { body, validationResult } from "express-validator";

export const productValidator = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("title must be a string")
    .bail()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "title must be contain letters between 3 to 50 characters long",
    ),
  body("description")
    .exists()
    .withMessage("description is required")
    .bail()
    .isString()
    .withMessage("description must be a string")
    .bail()
    .trim()
    .isLength({ min: 50, max: 150 })
    .withMessage(
      "description must be contain letters between 50 to 150 characters long",
    ),
  body("price").exists().withMessage("price is required").bail(),
  body("price.amount")
    .exists()
    .withMessage("amount is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("amount must be a number"),
  body("price.currency")
    .exists()
    .withMessage("Currency is required")
    .bail()
    .isString()
    .withMessage("Currency must be a String")
    .isIn(["INR", "USD"])
    .withMessage('Currency must be "INR" or "USD"'),
  body("sizes")
    .exists()
    .withMessage("Sizes are required")
    .bail()
    .isArray()
    .withMessage("Sizes must be an array of object"),
  body("sizes.*.size")
    .exists()
    .withMessage("size must be present in every entry of sizes array")
    .bail()
    .isString()
    .withMessage("size must be a string value")
    .bail()
    .trim()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("size can be one of these XS, S, M, L, XL, XXL."),
  body("sizes.*.stock")
    .exists()
    .withMessage("stock must be present in every entry of the sizes array")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Stock must be a integer value"),
    
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "invalid request",
        error: errors.array(),
      });
    }
    next();
  },
];
