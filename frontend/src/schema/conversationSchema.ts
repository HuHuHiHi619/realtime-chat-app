import { z } from "zod"

export const participantsUserSchema = z.object({
    id: z.number().int(),
    username: z.string(),
    email: z.string().email(),
})

export const participantSchema = z.object({
    user : participantsUserSchema
})

export const newConversationSchema = z.object({
    id: z.number().int(),
    type: z.enum(["PRIVATE", "GROUP"]),
    name: z.string().optional().nullable(), 
    user_id: z.number().int(), 
    joined_at: z.iso.datetime(), 
    last_read_message_id: z.number().int().optional().nullable(), 
   
    participants: z.array(participantSchema)
});


export const createConversationSchema = z.object({
    type : z.enum(["PRIVATE" , "GROUP"]),
    name : z.string().optional().nullable(),
    user_id : z.number(),
    participants : z.array(z.number().int().positive().min(1 , "participants must be at least 1"))
})

export const conversationResponseSchema = z.object({
    message: z.string(),
    newConversationSchema : newConversationSchema
})