import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { Server, Socket } from "socket.io";

const createConversationSchema = z.object({
  type: z.enum(["PRIVATE", "GROUP"]),
  name: z.string().optional().nullable(),
  user_id: z.number(),
  participants: z
    .array(z.number().int().positive())
    .min(1, "participants must be at least 1"),
});

const createMessageSchema = z.object({
  conversation_id: z.number().int().positive(),
  sender_id: z.number().int().positive(),
  content: z.string(),
  message_type: z.enum(["TEXT", "IMAGE", "VIDEO", "FILE", "SYSTEM"]),
});

const paramsSchema = z.object({
  conversation_id: z
    .string()
    .regex(/^\d+$/, "conversation_id must be a number"),
});

const querySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "page must be a number")
    .optional()
    .transform((val) => parseInt(val || "1")),
});

const prisma = new PrismaClient();
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}
export const createConversation = async (req: Request, res: Response) => {
  try {
    const validateData = createConversationSchema.safeParse(req.body);

    if (!validateData.success) {
      const tree = z.treeifyError(validateData.error);
      const pretty = z.prettifyError(validateData.error);
      return res.status(400).json({
        message: "Invalid data",
        pretty_error: pretty,
        tree_error: tree,
      });
    }

    const { type, name, user_id, participants } = validateData.data;

    if (!user_id || participants.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (type !== "PRIVATE" && participants.length !== 1) {
      return res.status(400).json({
        message: "Private conversation must have exactly 2 participants",
      });
    }
    if (type !== "GROUP" && participants.length < 2) {
      return res.status(400).json({
        message:
          "Group conversation must have exactly more than 2 participants",
      });
    }

    const allIds = [...new Set([user_id, ...participants])];
    const existingUsers = await prisma.user.findMany({
      where: { id: { in: allIds } },
    });
    if (existingUsers.length !== allIds.length)
      return res.status(400).json({ message: "Some user not found" });

    if (type === "PRIVATE") {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: "PRIVATE",
          participants: {
            every: {
              user_id: { in: allIds },
            },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, username: true, email: true },
              },
            },
          },
        },
      });
      if (existingConversation) {
        return res.status(200).json({
          message: "Conversation already exists",
          conversation: existingConversation,
        });
      }
    }

    const allParticipantsData = [...new Set([user_id, ...participants])].map(
      (user_id) => ({ user_id })
    );

    console.log("All participants data :", allParticipantsData);

    const newConversation = await prisma.conversation.create({
      data: {
        type: type,
        name: name,
        user_id: user_id,
        participants: {
          create: allParticipantsData,
        },
      },
      include: {
        participants: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: "Conversation created successfully",
      newConversation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const paramsParse = paramsSchema.safeParse(req.params);
    const queryParse = querySchema.safeParse(req.query);
    if (!paramsParse.success || !queryParse.success) {
      return res.status(400).json({
        message: "Invalid request",
        errors: {
          params: paramsParse.error?.format?.((issue) => issue.message),
          query: queryParse.error?.format?.((issue) => issue.message),
        },
      });
    }

    const conversation_id = parseInt(paramsParse.data.conversation_id);
    const page = queryParse.data.page || 1;

    const participant = await prisma.participant.findFirst({
      where: {
        conversation_id,
        user_id: (req as AuthenticatedRequest).user.id,
      },
    });

    if (!participant) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this conversation" });
    }

    const content = await prisma.message.findMany({
      where: {
        conversation_id: conversation_id,
      },
      orderBy: {
        sent_at: "desc",
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    const totalMessages = await prisma.message.count({
      where: {
        conversation_id: conversation_id,
      },
    });
    return res.status(200).json({
      message: "Messages fetched successfully",
      pagination: {
        page,
        limit: 50,
        total: totalMessages,
        hasMore: content.length < totalMessages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const user_id = (req as AuthenticatedRequest).user.id;
    if (!user_id) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            user_id: user_id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true, email: true },
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
    return res.status(200).json({ conversations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const setupSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-conversation", (conversation_id: number) => {
      socket.join(`conversation-${conversation_id}`);
      console.log(`User ${socket.id} joined conversation ${conversation_id}`);
    });
    socket.on("send-message", async (data) => {
      try {
        const validateData = createMessageSchema.safeParse(data);
        if (!validateData.success) {
          socket.emit("error", { message: "Invalid data" });
          return;
        }
        const { conversation_id, sender_id, content, message_type } =
          validateData.data;
        const participant = await prisma.participant.findFirst({
          where: {
            conversation_id: conversation_id,
            user_id: sender_id,
          },
        });
        if (!participant) {
          socket.emit("error", {
            message: "Not authorized to view this conversation",
          });
          return;
        }
        const newMessage = await prisma.message.create({
          data: {
            conversation_id,
            sender_id,
            content,
            message_type,
          },
          include: {
            sender: {
              select: { id: true, username: true },
            },
          },
        });
        await prisma.conversation.update({
          where: {
            id: conversation_id,
          },
          data: {
            edited_at: new Date(),
          },
        });

        io.to(`conversation-${conversation_id}`).emit("message", newMessage);
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
      socket.on("leave-conversation", (conversation_id: number) => {
        socket.leave(`conversation-${conversation_id}`);
      });
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  });
};

// สำรอง
export const createMessage = async (req: Request, res: Response) => {
  try {
    const validateData = createMessageSchema.safeParse(req.body);
    if (!validateData.success)
      return res.status(400).json({ message: "Invalid data" });

    const { conversation_id, sender_id, content, message_type } =
      validateData.data;

    const newMessage = await prisma.message.create({
      data: {
        conversation_id,
        sender_id,
        content,
        message_type,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
