import { Socket, Server } from "socket.io";
import { OnlineUserStore } from "./onlineUserStore";
import { UserStatusRepo } from "../repositories/UserStatusRepository";
import { UserStatusService } from "../services/userStatusService";
import { MessageRepository } from "../repositories/chat/MessageRepository";
import { MessageService } from "../services/chat/messageService";
import { ConversationService } from "../services/chat/conversationService";
import { ConversationRepository } from "../repositories/chat/ConversationRepository";
import { ClientConnectionHandler } from "./ClientConnectionHandler";

export const setupSocketHandlers = (io: Server) => {
  const onlineUserStore = new OnlineUserStore()
  const userStatusRepo = new UserStatusRepo()
  const messageRepo = new MessageRepository()
  const conversationRepo = new ConversationRepository()

  const userStatusService = new UserStatusService(
    onlineUserStore,
    userStatusRepo
  )
  const messageService = new MessageService(messageRepo)
  const conversationService = new ConversationService(conversationRepo)

  io.on('connection',(socket : Socket) => {
    console.log('User connected :', socket.id)
    new ClientConnectionHandler(
        io,
        socket,
        {
            userStatusService,
            messageService,
            conversationService
        },
        onlineUserStore
    )
  })

};
