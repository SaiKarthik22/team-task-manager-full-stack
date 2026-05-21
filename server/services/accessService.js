import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { AppError } from "../utils/AppError.js";

export const getAccessibleProject = async (projectId, user) => {
  const project = await Project.findById(projectId)
    .populate("members", "name email role")
    .populate("createdBy", "name email role");

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const isMember = project.members.some((member) => member._id.equals(user._id));
  if (user.role !== "Admin" && !isMember) {
    throw new AppError("You cannot access this project", 403);
  }

  return project;
};

export const getAccessibleTask = async (taskId, user) => {
  const task = await Task.findById(taskId)
    .populate("assignedUser", "name email role")
    .populate("createdBy", "name email role")
    .populate("project", "name status deadline members");

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const belongsToProject = task.project.members.some((memberId) => memberId.equals(user._id));
  const assignedToUser = task.assignedUser._id.equals(user._id);

  if (user.role !== "Admin" && !belongsToProject && !assignedToUser) {
    throw new AppError("You cannot access this task", 403);
  }

  return task;
};
