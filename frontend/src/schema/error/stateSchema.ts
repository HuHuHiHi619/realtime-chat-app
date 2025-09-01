import z from "zod";

export const apiErrorSchema = z.object({
  type : z.enum(["api" , "validation" , "unknown"]),
  message : z.string(),
  errors : z.record(z.string(),z.string()).optional()
})