import {
  CreateConversationInputDTO,
  GetActiveConversationServiceDTO,
  ParamsConversationInputDTO,
} from "../../types/conversation";
import { ConversationRepository } from "../../repositories/chat/ConversationRepository";

export class ConversationService {
  constructor(private conversationRepository: ConversationRepository) {}

  async getConversations(user_id  : number) {
    const conversations = await this.conversationRepository.findConversations(
      user_id
    );

    const result = conversations.map((c) => {
      const otherParticipants = c.participants.filter(
        (p) => p.user.id !== user_id
      );

      const friendData =
        c.type === "PRIVATE"
          ? otherParticipants[0].user || null
          : otherParticipants.map((p) => p.user);

      return {
        conversation_id: c.id,
        friend: friendData,
        last_message: c.messages[0] ? {
          ... c.messages[0],
          sent_at : new Date(c.messages[0].sent_at)
        } : null,
      };
    });

    return result ;
  }

  async getActiveConversation(data : GetActiveConversationServiceDTO ) {
    const activeConversation =
      await this.conversationRepository.findActiveConversation(data)

    return activeConversation;
  }

  async createConversation(data: CreateConversationInputDTO) {
    const uniqueParticipants = [
      ...new Set([data.user_id, ...data.participants]),
    ];

    if (data.type === "PRIVATE" && uniqueParticipants.length !== 2) {
      throw new Error("Private conversation must have 2 participants");
    }

    if (data.type === "GROUP" && uniqueParticipants.length < 2) {
      throw new Error("Group conversation must have at least 2 participants");
    }

    return await this.conversationRepository.createConversation({
      ...data,
      participants: uniqueParticipants,
    });
  }

  async updateLastActivity(data: ParamsConversationInputDTO) {
    return await this.conversationRepository.updateConversation(
      data.conversation_id
    );
  }
}
