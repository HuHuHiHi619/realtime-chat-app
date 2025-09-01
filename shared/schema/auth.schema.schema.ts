import z from "zod";

export const userSchema = z.object({
    email: z.email(),
    username: z.string(),
    id: z.number(),
    createdAt: z.string(),
    last_active_at: z.string().nullable(),
    updated_at: z.string(),
})

export const registerSchema = z.object({
    email : z.email("Please enter a valid email address"),
    username : z.string().min(3 , "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .refine(email => {
      return /\.(com|net|org|edu)$/.test(email.toLowerCase());
    }, {
      message: "Email domain must be .com, .net, .org, or .edu",
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginResponseSchema = userSchema
