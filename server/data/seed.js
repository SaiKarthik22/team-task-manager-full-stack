import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

dotenv.config();

const runSeed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({})
  ]);

  const [admin, member, designer] = await User.create([
    { name: "Avery Admin", email: "admin@example.com", password: "Admin@12345", role: "Admin" },
    { name: "Mina Member", email: "member@example.com", password: "Member@12345", role: "Member" },
    { name: "Dev Patel", email: "dev@example.com", password: "Member@12345", role: "Member" }
  ]);

  const now = new Date();
  const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const [launchProject, opsProject] = await Project.create([
    {
      name: "Website Launch",
      description: "Coordinate final content, QA, launch checklist, and post-launch monitoring.",
      deadline: addDays(21),
      status: "Active",
      members: [admin._id, member._id, designer._id],
      createdBy: admin._id
    },
    {
      name: "Support Workflow Upgrade",
      description: "Improve triage rules, routing, and support dashboard visibility.",
      deadline: addDays(35),
      status: "Planning",
      members: [admin._id, member._id],
      createdBy: admin._id
    }
  ]);

  await Task.create([
    {
      title: "Prepare launch QA checklist",
      description: "Create browser, accessibility, SEO, and regression checks for launch readiness.",
      priority: "High",
      status: "In Progress",
      dueDate: addDays(5),
      assignedUser: member._id,
      createdBy: admin._id,
      project: launchProject._id
    },
    {
      title: "Finalize hero imagery",
      description: "Export optimized visual assets and confirm responsive cropping.",
      priority: "Medium",
      status: "Pending",
      dueDate: addDays(8),
      assignedUser: designer._id,
      createdBy: admin._id,
      project: launchProject._id
    },
    {
      title: "Map support escalation rules",
      description: "Document current escalation paths and propose simplified owner routing.",
      priority: "Medium",
      status: "Pending",
      dueDate: addDays(14),
      assignedUser: member._id,
      createdBy: admin._id,
      project: opsProject._id
    }
  ]);

  console.log("Seed data created successfully");
  await mongoose.connection.close();
};

runSeed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
