import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/token.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id);

  return successResponse(res, 201, "Registration successful", {
    token,
    user: sanitizeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("This account is inactive", 403);
  }

  const token = signToken(user._id);

  return successResponse(res, 200, "Login successful", {
    token,
    user: sanitizeUser(user)
  });
});

export const profile = asyncHandler(async (req, res) => {
  return successResponse(res, 200, "Profile retrieved", { user: sanitizeUser(req.user) });
});
