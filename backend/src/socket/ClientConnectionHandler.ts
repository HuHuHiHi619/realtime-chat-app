import { ConversationService } from "../services/chat/conversationService";
import { MessageService } from "../services/chat/messageService";
import { UserStatusService } from "../services/userStatusService";
import { Socket, Server } from "socket.io";
import { OnlineUserStore } from "./onlineUserStore";
import { CreateMessageServiceDTO } from "../types/message";
import { createMessageSchema, paramsMessageSchema } from "@shared/schema/chat/message.schema";


interface AppServices {
  userStatusService: UserStatusService;
  messageService: MessageService;
  conversationService: ConversationService;
}

export class ClientConnectionHandler {
  constructor(
    private io: Server,
    private socket: Socket,
    private services: AppServices,
    private onlineUserStore: OnlineUserStore
  ) {}

  private registerAllHandlers(): void {
    // Conversation event
    this.socket.on("join-conversation", this.handleJoinConversation.bind(this));
    this.socket.on(
      "leave-conversation",
      this.handleLeaveConversation.bind(this)
    );

    // Message event
    this.socket.on("send-message", this.handleSendMessage.bind(this));

    // User status event
    this.socket.on("user:online", this.handleUserOnline.bind(this));
    this.socket.on(
      "conversation status : check",
      this.handleConverStatCheck.bind(this)
    );
    this.socket.on("disconnect", this.handleDisconnect.bind(this));
  }

  // Conversation handler
  private handleJoinConversation(conversation_id: number): void {
    this.socket.join(`conversation-${conversation_id}`);
    console.log(
      `User ${this.socket.id} joined conversation ${conversation_id}`
    );
  }
  private handleLeaveConversation(conversation_id: number) {
    this.socket.leave(`conversation-${conversation_id}`);
    console.log(`User ${this.socket.id} left conversation ${conversation_id}`);
  }

  // Message handler
  private async handleSendMessage(data: CreateMessageServiceDTO) {
    try {
      const validateParams = paramsMessageSchema.safeParse(data.conversation_id)
      const validateData = createMessageSchema.safeParse(data);
      
      if (!validateData.success) {
        this.socket.emit("error", { message: "Invalid data" });
        return;
      }

      if (!validateParams.success) {
        this.socket.emit("error", { message: "Invalid params" });
        return;
      }
      // แก้ใน route
      const { conversation_id } = validateParams.data
      const { sender_id, content, message_type } = validateData.data;
      const isParticipant =
        await this.services.messageService.checkParticipants(
          parseInt(sender_id),
          conversation_id
        );

      if (!isParticipant) {
        this.socket.emit("error", {
          message: "Not authorized  to view this conversation",
        });
      }
      const newMessage = await this.services.messageService.createMessage({
        conversation_id,
        sender_id,
        content,
        message_type,
      });
      await this.services.conversationService.updateLastActivity(
        validateParams.data
      );

      this.io.to(`conversation-${conversation_id}`).emit("message", newMessage);
    } catch (error) {
      console.error("Error sending message", error);
      this.socket.emit("error", { message: "An internal error occured." });
    }
  }

  // User status handler
  private handleUserOnline({user_id , username} : {user_id : number , username : string}) {
    this.onlineUserStore.add({
        socketId : this.socket.id,
        user_id,
        username,
        lastSeen: new Date(),
        joinedAt : new Date()
    })
    this.io.emit('user: status', {user_id, status : 'online'})
  }

  private async handleConverStatCheck(user_ids : number[]) {
    const status = await this.services.userStatusService.getConversationStatus(user_ids)
    this.socket.emit('conversation: status', status)
  }

  private handleDisconnect(){
    const removedUser = this.onlineUserStore.remove(this.socket.id)
    if(removedUser){
        this.io.emit('user: status', {user_id : removedUser.user_id , status : 'offline'})
    }
    console.log(`User disconnect :`, this.socket.id)
  }
}
