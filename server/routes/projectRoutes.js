import express from "express";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { projectIdValidation, projectValidation } from "../validations/projectValidators.js";

const router = express.Router();

router.route("/")
  .post(protect, authorize("Admin"), projectValidation, validate, createProject)
  .get(protect, listProjects);

router.route("/:id")
  .get(protect, projectIdValidation, validate, getProject)
  .put(protect, authorize("Admin"), projectIdValidation, projectValidation, validate, updateProject)
  .delete(protect, authorize("Admin"), projectIdValidation, validate, deleteProject);

export default router;
