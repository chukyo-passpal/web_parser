import { z } from "zod";

export const CubicsPtNewsEntrySchema = z.object({
    category: z.string().nullable(),
    status: z.string().nullable(),
    title: z.string(),
    link: z.string().nullable(),
});

export type CubicsPtNewsEntryDTO = z.infer<typeof CubicsPtNewsEntrySchema>;

export const CubicsPtNewsTabSchema = z.object({
    id: z.string(),
    title: z.string(),
    entries: z.array(CubicsPtNewsEntrySchema),
});

export type CubicsPtNewsTabDTO = z.infer<typeof CubicsPtNewsTabSchema>;

export const CubicsPtNewsSchema = z.object({
    selectedTabId: z.string().nullable(),
    tabs: z.array(CubicsPtNewsTabSchema),
});

export type CubicsPtNewsDTO = z.infer<typeof CubicsPtNewsSchema>;
