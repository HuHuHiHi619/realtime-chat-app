import { RequestHandler } from "express";
import { ApiError } from "../utils/apiError";

export const requireUser : RequestHandler = (req,res,next)  => {
    if(!req.user) return next(ApiError.unauthorized('User not found'))
    next()
}