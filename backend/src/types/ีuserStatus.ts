import { onlineUserSchema, userStatusDataSchema, userStatusResponseSchema } from "@shared/schema/userStatus.schema";
import z from "zod";

export type OnlineUser = z.infer<typeof onlineUserSchema>;
export type UserStatusData = z.infer<typeof userStatusDataSchema>;
export type UserStatusResponse = z.infer<typeof userStatusResponseSchema>;
