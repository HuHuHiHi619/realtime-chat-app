import "express";

declare global {
  namespace Express {
    interface Request {
      user: { id: number };
      validatedParams?: any;
      validatedQuery?: any;
      validatedBody?: any;
    }
  }
}
export {}

