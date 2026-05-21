import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask
} from "../controllers/taskController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { taskIdValidation, taskUpdateValidation, taskValidation } from "../validations/taskValidators.js";

const router = express.Router();

router.route("/")
  .post(protect, authorize("Admin"), taskValidation, validate, createTask)
  .get(protect, listTasks);

router.route("/:id")
  .get(protect, taskIdValidation, validate, getTask)
  .put(protect, taskIdValidation, taskUpdateValidation, validate, updateTask)
  .delete(protect, authorize("Admin"), taskIdValidation, validate, deleteTask);

export default router;
