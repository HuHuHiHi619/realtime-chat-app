import { loginSchema, registerSchema } from "@shared/schema/auth.schema.schema";
import z from "zod";

export interface AuthRequest extends Request {
  user: { id: number }; 
}

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>