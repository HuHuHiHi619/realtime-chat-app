import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import { ApiError } from "../utils/apiError";

const payloadSchema = z.object({
  user_id: z.number(),
});

export const authenticateToken : RequestHandler = (
  req,
  res,
  next
) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(ApiError.unauthorized("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    const parseResult = payloadSchema.safeParse(decoded);
    if (!parseResult.success) {
      return next(ApiError.unauthorized("Invalid Token"));
    }

    req.user = { id: parseResult.data.user_id };

    next();
  } catch (err) {
    return next(ApiError.unauthorized("Invalid Token"));
  }
};
