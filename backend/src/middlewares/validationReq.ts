import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { ApiError } from "../utils/apiError";

type AugmentedRequest<Body = any, Query = any, Params = any> = Request<Params, any, Body, Query> & {
  validatedBody?: Body;
  validatedQuery?: Query;
  validatedParams?: Params;
};


export const validateRequest = <
  Params extends ZodType = ZodType,
  Query extends ZodType = ZodType,
  Body extends ZodType = ZodType
>(schemas: { body?: Body; query?: Query; params?: Params }) => {
  return async (
    req: AugmentedRequest,
    res: Response,
    next: NextFunction
  ) => {

    try {
      console.log("reqParams",req.params)
      if (schemas.body) req.validatedBody = await schemas.body.parseAsync(req.body);
      if (schemas.query) req.validatedQuery = await schemas.query.parseAsync(req.query);
      if (schemas.params) req.validatedParams = await schemas.params.parseAsync(req.params);
      console.log("validateparams",req.validatedParams)
      
      
      next();
    } catch (err: any) {
      const fieldErrors: Record<string, string> = {};
      if (err.issues) {
        err.issues.forEach((issue: any) => {
          const path = issue.path.join(".");
          fieldErrors[path] = issue.message;
        });
      }
      next(ApiError.validation(fieldErrors));
    }
  };
};