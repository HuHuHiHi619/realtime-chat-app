import socket from "./socketClient"
import { useChatStore } from "../store"


export const initMessageListner = () => {
    socket.off('message')

    socket.on('message' , (data) => {
        console.log(`[SOCKET] Received message:`, data);
        const {
            conversations,
            activeConversation,
            messages,
            setMessages,
            setConversations,
            setActiveConversation
        } = useChatStore.getState()

        if(activeConversation?.conversation_id === data.conversation_id) {
            setMessages([...messages , data])
        }

        const updateConver = conversations.map((conver) => 
            conver.conversation_id === data.conversation_id
            ? {
                ...conver,
                last_message : {
                    id : data.id ,
                    content : data.content,
                    sent_at : data.sent_at,
                    sender_id : data.sender_id
                }
            } : conver)
        setConversations(updateConver)

        if(activeConversation?.conversation_id !== data.conversation_id) {
            setActiveConversation({
                ...activeConversation,
                conversation_id :   data.conversation_id,
                conversation_name : data.conversation_name,
                conversation_type : data.conversation_type,
                participants : data.participants,
                last_message : {
                    id : data.id,
                    content : data.content,
                    sent_at : data.sent_at,
                    sender_id : data.sender_id
                }
            })
        }

    })
}