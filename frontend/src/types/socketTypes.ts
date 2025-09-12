import { z } from "zod"
import { socketSchema } from "../schema/socket/socketSchema"
export type SocketState = z.infer<typeof socketSchema> & {
    connect : () => void
    disconnect : () => void
    emit: (e : string , data : any) => void
    forceReconnect: () => void;
}