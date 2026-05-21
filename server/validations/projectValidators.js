import { body, param } from "express-validator";
import { isValidObjectId, notPastDate } from "./commonValidators.js";

export const projectIdValidation = [
  param("id").custom(isValidObjectId).withMessage("Invalid project id")
];

export const projectValidation = [
  body("name").trim().notEmpty().withMessage("Project name is required").isLength({ min: 2, max: 120 }),
  body("description").trim().notEmpty().withMessage("Description is required").isLength({ max: 1000 }),
  body("deadline").isISO8601().withMessage("Valid deadline is required").custom(notPastDate).withMessage("Deadline cannot be in the past"),
  body("status").optional().isIn(["Planning", "Active", "On Hold", "Completed"]).withMessage("Invalid project status"),
  body("members").optional().isArray().withMessage("Members must be an array"),
  body("members.*").optional().custom(isValidObjectId).withMessage("Invalid member id")
];
