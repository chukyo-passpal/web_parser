import { z } from "zod";

export const ManaboEntryFormSchema = z.object({
  action: z.string(),
  classId: z.string(),
  directoryId: z.string(),
  entryId: z.string(),
  uniqid: z.string(),
  messages: z.array(z.string()),
});

export type ManaboEntryFormDTO = z.infer<typeof ManaboEntryFormSchema>;

export const ManaboEntryResponseSchema = z.object({
  success: z.boolean(),
  html: z.string().nullable(),
  error: z.string().nullable(),
  message: z.string().nullable(),
  data: z.object({
    is_accepted: z.number(),
  }),
});

export type ManaboEntryResponseDTO = z.infer<typeof ManaboEntryResponseSchema>;
