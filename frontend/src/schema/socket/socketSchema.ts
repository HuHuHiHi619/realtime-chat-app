import { z } from "zod"

export const socketSchema = z.object({
   socket: z.any().nullable(),
   isConnected : z.boolean(),
   reconnectAttempts : z.number(),
   maxReconnectAttemps: z.number(),
})

