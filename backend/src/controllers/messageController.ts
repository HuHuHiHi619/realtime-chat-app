import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

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

const prisma = new PrismaClient();
export const createConversation = async (req: Request, res: Response) => {
  try {
    const validateData = createConversationSchema.safeParse(req.body);

    if (!validateData.success) {
        const tree = z.treeifyError(validateData.error);
        const pretty = z.prettifyError(validateData.error)
        return res.status(400).json({ 
            message: "Invalid data",
            pretty_error: pretty,
            tree_error: tree
        });
    }

    const { type, name, user_id, participants } = validateData.data;

    if (!user_id || participants.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (type !== "PRIVATE" && participants.length !== 1) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const allIds = [...new Set([user_id , ...participants])]
    const existingUsers = await prisma.user.findMany({
        where : { id : { in : allIds } }
    })
    if(existingUsers.length !== allIds.length) return res.status(400).json({message : "Some user not found"})
    console.log('Existing users founded :', existingUsers)

    const allParticipantsData = [...new Set([user_id, ...participants])].map(
      (user_id) => ({ user_id })
    );

    console.log('All participants data :',allParticipantsData)

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
        newConversation
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const validateData = createMessageSchema.safeParse(req.body)
    if(!validateData.success) return res.status(400).json({message : "Invalid data"})

    const { conversation_id, sender_id, content, message_type } = validateData.data;
  
    const newMessage = await prisma.message.create({
        data: {
            conversation_id,
            sender_id,
            content,
            message_type
        },
        include : {
            sender : {
                select : {
                    id : true , 
                    username : true
                }
            }
        }
    })

    res.status(201).json(newMessage)

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
