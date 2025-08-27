import { z } from 'zod';

export const MessageSchema = z.object({
  type: z.literal("message"),
  message_id: z.number(),
  conversation_id: z.number(),
  sender_id: z.number(),
  text: z.string(),
  sent_at: z.string(),
});

export const UserSchema = z.object({
  type: z.literal("user"),
  id: z.number(),
  username: z.string(),
});

export const SystemMessageSchema = z.object({
  type: z.literal("system"),
  code: z.string(),
  text: z.string(),
  timestamp: z.string(),
});

export const IncomingPayloadSchema = z.discriminatedUnion("type", [
  MessageSchema,
  UserSchema,
  SystemMessageSchema,
]);

export const ServerEnvelopeSchema = z.object({
    type: z.string(),
    data: z.any(),
});
