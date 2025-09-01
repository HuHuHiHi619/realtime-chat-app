import {  CreateMessageRepoDTO, GetMessageRepoDTO } from "../../types/message";
import prisma from "../../prisma/prismaClient";

export class MessageRepository {
  async countMessage(conversation_id: number) {
    return prisma.message.count({
      where: { conversation_id },
    });
  }

  async findMessages(data : GetMessageRepoDTO) {
    const { conversation_id , skip , take } = data
    return await prisma.message.findMany({
      where: { conversation_id },
      select: {
        id: true,
        sender_id: true,
        content: true,
        sent_at: true,
        message_type: true,
        is_edited: true,
      },
      orderBy: { sent_at: "asc" },
      take,
      skip,
    });
  }

  async findParticipants(user_id: number, conversation_id: number) {
    const participants = await prisma.participant.findFirst({
      where: { user_id, conversation_id },
    });
    return !!participants;
  }

  async createMessage(data : CreateMessageRepoDTO) {
    const { conversation_id , sender_id , content , message_type } = data
    return await prisma.message.create({
      data: {
        conversation_id,
        sender_id,
        content,
        message_type,
      },
      select: {
        id: true,
        conversation_id: true,
        sender_id: true,
        content: true,
        sent_at: true,
        message_type: true,
      },
    });
  }
}
