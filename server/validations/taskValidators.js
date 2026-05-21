import { body, param } from "express-validator";
import { isValidObjectId, notPastDate } from "./commonValidators.js";

export const taskIdValidation = [
  param("id").custom(isValidObjectId).withMessage("Invalid task id")
];

export const taskValidation = [
  body("title").trim().notEmpty().withMessage("Task title is required").isLength({ min: 2, max: 140 }),
  body("description").trim().notEmpty().withMessage("Task description is required").isLength({ max: 1200 }),
  body("priority").optional().isIn(["Low", "Medium", "High"]).withMessage("Invalid priority"),
  body("status").optional().isIn(["Pending", "In Progress", "Completed"]).withMessage("Invalid status"),
  body("dueDate").isISO8601().withMessage("Valid due date is required").custom(notPastDate).withMessage("Due date cannot be in the past"),
  body("assignedUser").custom(isValidObjectId).withMessage("Valid assigned user is required"),
  body("project").custom(isValidObjectId).withMessage("Valid project is required")
];

export const taskUpdateValidation = [
  body("title").optional().trim().isLength({ min: 2, max: 140 }),
  body("description").optional().trim().isLength({ min: 2, max: 1200 }),
  body("priority").optional().isIn(["Low", "Medium", "High"]),
  body("status").optional().isIn(["Pending", "In Progress", "Completed"]),
  body("dueDate").optional().isISO8601().custom(notPastDate).withMessage("Due date cannot be in the past"),
  body("assignedUser").optional().custom(isValidObjectId),
  body("project").optional().custom(isValidObjectId)
];
