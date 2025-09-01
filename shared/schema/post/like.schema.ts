import z from "zod";

export const getLikesSchema = z.object({
    author_id : z.number(),
    post_id : z.number().optional(),
    comment_id : z.number().optional()
})

export const validateLikeSchema = z.object({
    post_id : z.string().optional().transform((val) => val ? parseInt(val) : undefined),
    comment_id : z.string().optional().transform((val) => val ? parseInt(val) : undefined)
})