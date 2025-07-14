import { z } from "zod"

const isValidUrlOrPath = (value : string) : boolean => {
    try {
        new URL(value)
        return true
    } catch (error) {
        const pathRegex = /^[a-zA-Z0-9_\-/]+(\.[a-zA-Z0-9]+)?$/;
        return pathRegex.test(value)
    }
}

export const createMessageSchema = z.object({
    conversation_id : z.number().int().positive(),
    sender_id : z.number().int().positive(),
    content : z.string(),
    message_type : z.enum(["TEXT" , "IMAGE" , "VIDEO" , "FILE" , "SYSTEM"])
}).refine(data => {
    if(["IMAGE" , "VIDEO", "FILE"].includes(data.message_type)) {
        return isValidUrlOrPath(data.content)
    }
    return true 
}, {
    message: "Content must be a valid URL or path if message type is IMAGE, VIDEO, or FILE",
    path: ["content"]
})