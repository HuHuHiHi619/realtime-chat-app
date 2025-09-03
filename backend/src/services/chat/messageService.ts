import { CreateMessageServiceDTO, GetMessageServiceDTO } from "../../types/message"
import { MessageRepository } from "../../repositories/chat/MessageRepository"

export class MessageService{
    constructor(private messageRepository : MessageRepository) {}

    async checkParticipants(user_id: number, conversation_id: number) {
      return this.messageRepository.findParticipants(user_id, conversation_id)
    }

    async getMessages ({ conversation_id , page , limit }: GetMessageServiceDTO) {
        const totalMessages = await this.messageRepository.countMessage(conversation_id)
        const skip = Math.max(totalMessages - page * limit , 0)
        const hasMore = page * limit <totalMessages
        
    
        const messages = await this.messageRepository.findMessages({conversation_id, skip, take : limit})

        return {
            pagination : {
                page,
                limit : limit,
                total : totalMessages,
                hasMore
            },
            messages : messages.map(msg => ({
                ...msg,
                sent_at : msg.sent_at instanceof Date
                ? msg.sent_at.toISOString()
                : String(msg.sent_at),
                sender_id : Number(msg.sender_id)
            }))
        }
    }

    async createMessage (data : CreateMessageServiceDTO) {
        return this.messageRepository.createMessage(data)
    }

  

   
}