import z from "zod";

// ข้อมูลของ user ที่ออนไลน์อยู่ (state ใน memory)
export const onlineUserSchema = z.object({
  socketId: z.string(),
  user_id: z.number().int().positive(),
  username: z.string().max(50),
  lastSeen: z.date(),
  joinedAt: z.date()
});

// ใช้ใน API response สำหรับ online/offline
export const userStatusDataSchema = z.object({
  userId: z.number().int().positive(),
  username: z.string().max(50),
  lastSeen: z.date().optional()
});

// ใช้ตรวจว่าใน conversation มีใครบ้าง
export const conversationOnlineSchema = z.object({
  userIds: z.array(z.number().int().positive())
});

// API response
export const userStatusResponseSchema = z.object({
  online: z.array(userStatusDataSchema),
  offline: z.array(userStatusDataSchema)
});

