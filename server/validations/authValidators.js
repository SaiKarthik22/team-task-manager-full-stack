import { body } from "express-validator";
import { strongPasswordRegex } from "./commonValidators.js";

export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2, max: 80 }),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .matches(strongPasswordRegex)
    .withMessage("Password must include uppercase, lowercase, number, special character, and be at least 8 characters"),
  body("role").optional().isIn(["Admin", "Member"]).withMessage("Role must be Admin or Member")
];

export const loginValidation = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required")
];
