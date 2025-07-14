import { z } from "zod"

export const userResponseSchema = z.object({
        id: z.number(),
        email: z.email(),
        username: z.string(),
        createdAt: z.string(),
        last_active_at: z.string(),
        updated_at: z.string(),
})

export const authResponseSchema = z.object({
    message: z.string(),
    user: userResponseSchema.optional()
})

export const loginResponseSchema = z.object({
    message: z.string(),
    user: userResponseSchema
})

export const registerInputSchema = z.object({
    email : z.email(),
    username: z.string(),
    password: z.string().min(6 , 'Password must be at least 6 characters')
})
export const loginInputSchema = z.object({
    email : z.email(),
    password: z.string()
})