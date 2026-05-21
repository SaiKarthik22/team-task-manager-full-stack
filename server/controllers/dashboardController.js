import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const projectQuery = req.user.role === "Admin" ? {} : { members: req.user._id };
  const taskQuery = req.user.role === "Admin" ? {} : { assignedUser: req.user._id };
  const now = new Date();

  const [projects, tasks, recentTasks] = await Promise.all([
    Project.find(projectQuery).populate("members", "name email role"),
    Task.find(taskQuery).populate("assignedUser", "name email role").populate("project", "name status deadline"),
    Task.find(taskQuery).populate("assignedUser", "name email role").populate("project", "name").sort({ updatedAt: -1 }).limit(6)
  ]);

  const statusCounts = {
    Pending: tasks.filter((task) => task.status === "Pending").length,
    "In Progress": tasks.filter((task) => task.status === "In Progress").length,
    Completed: tasks.filter((task) => task.status === "Completed").length
  };

  const priorityCounts = {
    Low: tasks.filter((task) => task.priority === "Low").length,
    Medium: tasks.filter((task) => task.priority === "Medium").length,
    High: tasks.filter((task) => task.priority === "High").length
  };

  const projectProgress = projects.map((project) => {
    const projectTasks = tasks.filter((task) => String(task.project._id) === String(project._id));
    const completed = projectTasks.filter((task) => task.status === "Completed").length;
    const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
    return {
      id: project._id,
      name: project.name,
      status: project.status,
      progress
    };
  });

  return successResponse(res, 200, "Dashboard stats retrieved", {
    cards: {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: statusCounts.Completed,
      pendingTasks: statusCounts.Pending,
      overdueTasks: tasks.filter((task) => task.status !== "Completed" && task.dueDate < now).length
    },
    charts: {
      statusCounts,
      priorityCounts,
      projectProgress
    },
    recentActivity: recentTasks,
    assignedTasks: tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 10)
  });
});
