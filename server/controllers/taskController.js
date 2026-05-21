import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { getAccessibleTask } from "../services/accessService.js";
import { AppError } from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const ensureTaskRelationship = async ({ projectId, assignedUserId }) => {
  const [project, assignedUser] = await Promise.all([
    Project.findById(projectId),
    User.findById(assignedUserId)
  ]);

  if (!project) throw new AppError("Project not found", 404);
  if (!assignedUser || !assignedUser.isActive) throw new AppError("Assigned user not found", 404);

  const isProjectMember = project.members.some((memberId) => memberId.equals(assignedUser._id));
  if (!isProjectMember) {
    throw new AppError("Assigned user must be a member of the project", 400);
  }

  return { project, assignedUser };
};

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate, assignedUser, project } = req.body;
  await ensureTaskRelationship({ projectId: project, assignedUserId: assignedUser });

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate,
    assignedUser,
    project,
    createdBy: req.user._id
  });

  const populated = await Task.findById(task._id)
    .populate("assignedUser", "name email role")
    .populate("createdBy", "name email role")
    .populate("project", "name status deadline");

  return successResponse(res, 201, "Task created", { task: populated });
});

export const listTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, sort = "dueDate", project, deadline } = req.query;
  const query = {};

  if (req.user.role !== "Admin") query.assignedUser = req.user._id;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (project) query.project = project;
  if (search) query.$text = { $search: search };
  if (deadline === "overdue") query.dueDate = { $lt: new Date() };
  if (deadline === "upcoming") query.dueDate = { $gte: new Date() };

  const allowedSorts = {
    dueDate: { dueDate: 1 },
    newest: { createdAt: -1 },
    priority: { priority: -1 },
    status: { status: 1 }
  };

  const tasks = await Task.find(query)
    .populate("assignedUser", "name email role")
    .populate("createdBy", "name email role")
    .populate("project", "name status deadline")
    .sort(allowedSorts[sort] || allowedSorts.dueDate);

  return successResponse(res, 200, "Tasks retrieved", { tasks });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await getAccessibleTask(req.params.id, req.user);
  return successResponse(res, 200, "Task retrieved", { task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (req.user.role !== "Admin" && !task.assignedUser.equals(req.user._id)) {
    throw new AppError("Members can only update their own assigned tasks", 403);
  }

  const adminFields = ["title", "description", "priority", "dueDate", "assignedUser", "project"];
  const memberTouchedAdminField = adminFields.some((field) => Object.prototype.hasOwnProperty.call(req.body, field));

  if (req.user.role !== "Admin" && memberTouchedAdminField) {
    throw new AppError("Members can only update task status", 403);
  }

  if (req.user.role === "Admin" && (req.body.project || req.body.assignedUser)) {
    await ensureTaskRelationship({
      projectId: req.body.project || task.project,
      assignedUserId: req.body.assignedUser || task.assignedUser
    });
  }

  Object.entries(req.body).forEach(([key, value]) => {
    if (value !== undefined) task[key] = value;
  });

  await task.save();

  const populated = await Task.findById(task._id)
    .populate("assignedUser", "name email role")
    .populate("createdBy", "name email role")
    .populate("project", "name status deadline");

  return successResponse(res, 200, "Task updated", { task: populated });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  await task.deleteOne();
  return successResponse(res, 200, "Task deleted");
});
