import User from "../models/User.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isActive: true }).select("name email role createdAt").sort({ name: 1 });
  return successResponse(res, 200, "Users retrieved", { users });
});
