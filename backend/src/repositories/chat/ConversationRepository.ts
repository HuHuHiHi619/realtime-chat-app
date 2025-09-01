import prisma from "../../prisma/prismaClient";
import { CreateConversationInputDTO, GetActiveConversationServiceDTO } from "../../types/conversation";

export class ConversationRepository  {
  async checkUserExists(user_id: number) {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
      select: { id: true },
    });
    return !!user;
  }

  async getUserByIds(userIds: number[]) {
    return await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });
  }

  async findConversations(user_id: number) {
    return await prisma.conversation.findMany({
      where: { user_id },
      select: {
        id: true,
        name: true,
        type: true,
        edited_at: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        messages: {
          select: { id: true, content: true, sent_at: true, sender_id: true },
          orderBy: {
            sent_at: "desc",
          },
          take: 1,
        },
      },
      orderBy: { edited_at: "desc" },
    });
  }

  async findActiveConversation(data : GetActiveConversationServiceDTO) {
    const { conversation_id , user_id } = data
    const activeConversation = await prisma.conversation.findFirst({
      where: {
        id: conversation_id,
        participants: {
          some: {
            user_id: user_id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    const last_message = await prisma.message.findFirst({
      where: {
        conversation_id: conversation_id,
      },
      orderBy: {
        sent_at: "desc",
      },
      select: {
        id: true,
        content: true,
        sent_at: true,
        sender_id: true,
      },
    });

    if (!activeConversation) throw new Error("Conversation not found");

    return {
      conversation_id: activeConversation.id,
      conversation_name: activeConversation.name ?? "",
      conversation_type: activeConversation.type,
      participants: activeConversation.participants.map((p) => p.user),
      last_message: last_message ?? null,
    };
  }

  async createConversation(data: CreateConversationInputDTO) {
    const participantsData = data.participants.map((p) => ({ user_id: p })); 
    const conversation = await prisma.conversation.create({
      data: {
        type: data.type,
        name: data.name,
        user_id: data.user_id,
        participants: {
          create: participantsData,
        },
      },
      include: {
        participants: {
          select: {
            user: {
              select: { id: true, username: true, email: true },
            },
          },
        },
      },
    });

    return {
      type: conversation.type,
      name: conversation.name,
      user_id: conversation.user_id,
      participants: conversation.participants.map((p) => p.user),
    }
  }

  async updateConversation(conversation_id : number){
    return await prisma.conversation.update({
      where : { id : conversation_id },
      data : {
        edited_at : new Date()
      }
    })
  }
}
