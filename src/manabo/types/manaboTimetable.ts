import { z } from "zod";

export const ManaboTimetableSlotSchema = z.object({
    day: z.string(),
    className: z.string().nullable(),
    teacher: z.string().nullable(),
    href: z.string().nullable(),
});

export type ManaboTimetableSlotDTO = z.infer<typeof ManaboTimetableSlotSchema>;

export const ManaboTimetablePeriodSchema = z.object({
    period: z.string(),
    slots: z.array(ManaboTimetableSlotSchema),
});

export type ManaboTimetablePeriodDTO = z.infer<typeof ManaboTimetablePeriodSchema>;

export const ManaboTimetableTermSchema = z.object({
    archiveId: z.string(),
    label: z.string(),
    active: z.boolean(),
});

export type ManaboTimetableTermDTO = z.infer<typeof ManaboTimetableTermSchema>;

export const ManaboTimetableViewModeSchema = z.object({
    archiveId: z.string(),
    mode: z.string().nullable(),
    label: z.string(),
    active: z.boolean(),
});

export type ManaboTimetableViewModeDTO = z.infer<typeof ManaboTimetableViewModeSchema>;

export const ManaboTimetableSchema = z.object({
    title: z.string(),
    terms: z.array(ManaboTimetableTermSchema),
    viewModes: z.array(ManaboTimetableViewModeSchema),
    days: z.array(z.string()),
    periods: z.array(ManaboTimetablePeriodSchema),
});

export type ManaboTimetableDTO = z.infer<typeof ManaboTimetableSchema>;
