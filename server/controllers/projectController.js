import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { getAccessibleProject } from "../services/accessService.js";
import { AppError } from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const normalizeMembers = (members = [], creatorId) => {
  const values = members.map(String);
  values.push(String(creatorId));
  return [...new Set(values)];
};

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, deadline, status, members = [] } = req.body;
  const projectMembers = normalizeMembers(members, req.user._id);
  const foundMembers = await User.find({ _id: { $in: projectMembers }, isActive: true });

  if (foundMembers.length !== projectMembers.length) {
    throw new AppError("One or more project members are invalid", 400);
  }

  const project = await Project.create({
    name,
    description,
    deadline,
    status,
    members: projectMembers,
    createdBy: req.user._id
  });

  const populated = await Project.findById(project._id)
    .populate("members", "name email role")
    .populate("createdBy", "name email role");

  return successResponse(res, 201, "Project created", { project: populated });
});

export const listProjects = asyncHandler(async (req, res) => {
  const query = req.user.role === "Admin" ? {} : { members: req.user._id };
  const projects = await Project.find(query)
    .populate("members", "name email role")
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  return successResponse(res, 200, "Projects retrieved", { projects });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await getAccessibleProject(req.params.id, req.user);
  const tasks = await Task.find({ project: project._id })
    .populate("assignedUser", "name email role")
    .populate("createdBy", "name email role")
    .sort({ dueDate: 1 });

  return successResponse(res, 200, "Project retrieved", { project, tasks });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { name, description, deadline, status, members } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (members) {
    const projectMembers = normalizeMembers(members, project.createdBy);
    const foundMembers = await User.find({ _id: { $in: projectMembers }, isActive: true });
    if (foundMembers.length !== projectMembers.length) {
      throw new AppError("One or more project members are invalid", 400);
    }
    project.members = projectMembers;
  }

  project.name = name ?? project.name;
  project.description = description ?? project.description;
  project.deadline = deadline ?? project.deadline;
  project.status = status ?? project.status;

  await project.save();

  const populated = await Project.findById(project._id)
    .populate("members", "name email role")
    .populate("createdBy", "name email role");

  return successResponse(res, 200, "Project updated", { project: populated });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  return successResponse(res, 200, "Project and related tasks deleted");
});
