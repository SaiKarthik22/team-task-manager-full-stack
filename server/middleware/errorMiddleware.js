import { errorResponse } from "../utils/apiResponse.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  if (err.name === "CastError") {
    return errorResponse(res, 400, "Invalid resource identifier");
  }

  if (err.code === 11000) {
    return errorResponse(res, 409, "Duplicate field value entered");
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((item) => item.message);
    return errorResponse(res, 400, "Validation failed", errors);
  }

  return errorResponse(
    res,
    statusCode,
    statusCode === 500 ? "Internal server error" : err.message
  );
};
