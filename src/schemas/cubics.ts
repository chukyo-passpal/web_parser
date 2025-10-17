import { z } from "zod";

export const CubicsAsTimetableSlotSchema = z.object({
    classroom: z.string().nullable(),
    subject: z.string().nullable(),
    detailUrl: z.string().nullable(),
    lessonCode: z.string().nullable(),
    lessonYear: z.string().nullable(),
    termCode: z.string().nullable(),
    timetableCode: z.string().nullable(),
    optionDate: z.string().nullable(),
});

export type CubicsAsTimetableSlotDTO = z.infer<typeof CubicsAsTimetableSlotSchema>;

export const CubicsAsTimetablePeriodSchema = z.object({
    periodLabel: z.string(),
    slots: z.array(CubicsAsTimetableSlotSchema),
});

export type CubicsAsTimetablePeriodDTO = z.infer<typeof CubicsAsTimetablePeriodSchema>;

export const CubicsAsTimetableSchema = z.object({
    student: z.object({
        id: z.string(),
        name: z.string(),
        division: z.string(),
        affiliation: z.string(),
        status: z.string(),
        className: z.string(),
        faculty: z.string(),
        department: z.string(),
        course: z.string(),
        address: z.string(),
    }),
    periodRange: z.string(),
    days: z.array(
        z.object({
            label: z.string(),
            date: z.string(),
        })
    ),
    periods: z.array(CubicsAsTimetablePeriodSchema),
});

export type CubicsAsTimetableDTO = z.infer<typeof CubicsAsTimetableSchema>;
