import { z } from "zod";

export const ManaboClassDirectoryItemSchema = z.object({
    directoryId: z.string(),
    title: z.string(),
});

export type ManaboClassDirectoryItemDTO = z.infer<typeof ManaboClassDirectoryItemSchema>;

export const ManaboClassDirectorySchema = z.object({
    classId: z.string(),
    className: z.string(),
    directories: z.array(ManaboClassDirectoryItemSchema),
});

export type ManaboClassDirectoryDTO = z.infer<typeof ManaboClassDirectorySchema>;

export const ManaboClassContentActionSchema = z.object({
    label: z.string(),
    url: z.string(),
});

export type ManaboClassContentActionDTO = z.infer<typeof ManaboClassContentActionSchema>;

export const ManaboClassContentItemSchema = z.object({
    contentId: z.string(),
    pluginKey: z.string(),
    title: z.string(),
    iconSrc: z.string().nullable(),
    descriptionHtml: z.string().nullable(),
    action: ManaboClassContentActionSchema.nullable(),
});

export type ManaboClassContentItemDTO = z.infer<typeof ManaboClassContentItemSchema>;

export const ManaboClassContentSchema = z.object({
    items: z.array(ManaboClassContentItemSchema),
});

export type ManaboClassContentDTO = z.infer<typeof ManaboClassContentSchema>;

export const ManaboClassNotAttendContentSchema = z.object({
    contentHtml: z.string(),
});

export type ManaboClassNotAttendContentDTO = z.infer<typeof ManaboClassNotAttendContentSchema>;

export const ManaboClassEntryRowSchema = z.object({
    directory: z.string(),
    lectureDate: z.string().nullable(),
    status: z.string(),
});

export type ManaboClassEntryRowDTO = z.infer<typeof ManaboClassEntryRowSchema>;

export const ManaboClassEntrySchema = z.object({
    rows: z.array(ManaboClassEntryRowSchema),
});

export type ManaboClassEntryDTO = z.infer<typeof ManaboClassEntrySchema>;

export const ManaboClassNewsItemSchema = z.object({
    id: z.string().nullable(),
    title: z.string(),
    bodyHtml: z.string(),
});

export type ManaboClassNewsItemDTO = z.infer<typeof ManaboClassNewsItemSchema>;

export const ManaboClassNewsSchema = z.object({
    items: z.array(ManaboClassNewsItemSchema),
});

export type ManaboClassNewsDTO = z.infer<typeof ManaboClassNewsSchema>;

export const ManaboClassSyllabusSectionSchema = z.object({
    label: z.string(),
    valueHtml: z.string(),
});

export type ManaboClassSyllabusSectionDTO = z.infer<typeof ManaboClassSyllabusSectionSchema>;

export const ManaboClassSyllabusLessonPlanSchema = z.object({
    number: z.string(),
    topic: z.string(),
    detail: z.string(),
});

export type ManaboClassSyllabusLessonPlanDTO = z.infer<typeof ManaboClassSyllabusLessonPlanSchema>;

export const ManaboClassSyllabusSchema = z.object({
    title: z.string(),
    sections: z.array(ManaboClassSyllabusSectionSchema),
    lessonPlan: z.array(ManaboClassSyllabusLessonPlanSchema),
});

export type ManaboClassSyllabusDTO = z.infer<typeof ManaboClassSyllabusSchema>;

export const ManaboClassQuizResultQuestionSchema = z.object({
    page: z.string(),
    questionNumber: z.string(),
    questionText: z.string(),
    correctAnswer: z.string(),
    studentAnswer: z.string(),
    resultIconAlt: z.string().nullable(),
    resultIconSrc: z.string().nullable(),
    resultText: z.string().nullable(),
    teacherComment: z.string().nullable(),
});

export type ManaboClassQuizResultQuestionDTO = z.infer<typeof ManaboClassQuizResultQuestionSchema>;

export const ManaboClassQuizResultSchema = z.object({
    score: z.object({
        obtained: z.number(),
        total: z.number(),
    }),
    totalItemsText: z.string().nullable(),
    questions: z.array(ManaboClassQuizResultQuestionSchema),
});

export type ManaboClassQuizResultDTO = z.infer<typeof ManaboClassQuizResultSchema>;
