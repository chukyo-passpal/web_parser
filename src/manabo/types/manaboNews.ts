import { z } from "zod";

export const ManaboNewsItemSchema = z.object({
    text: z.string(),
});

export type ManaboNewsItemDTO = z.infer<typeof ManaboNewsItemSchema>;

export const ManaboNewsSchema = z.object({
    message: z.string().nullable(),
    items: z.array(ManaboNewsItemSchema),
});

export type ManaboNewsDTO = z.infer<typeof ManaboNewsSchema>;
