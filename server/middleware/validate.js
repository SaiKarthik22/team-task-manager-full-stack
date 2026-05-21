import { validationResult } from "express-validator";
import { errorResponse } from "../utils/apiResponse.js";

export const validate = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return errorResponse(
    res,
    400,
    "Validation failed",
    result.array().map((error) => ({
      field: error.path,
      message: error.msg
    }))
  );
};
