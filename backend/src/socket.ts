import { Server } from "socket.io";
import { Server as HTTPServer } from 'http'

export function setupSocket(io : Server){
    io.on('connection', (socket) => {
        console.log('a user connected');
        
        socket.on("join_conversation", (conversation_id: number) => {
            socket.join(String(conversation_id))
            console.log(`User ${socket.id} joined conversation ${conversation_id}`);
        })

        socket.on("sent_message" ,(messageData) => {
            const { conversation_id , sender_id , content , message_type } = messageData

            socket.to(String(conversation_id)).emit('recieve_message' , messageData)
        })

        socket.on("disconnect", () => {
            console.log('a user disconnected');
        });
    })

    
}