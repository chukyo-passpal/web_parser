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

export const ManaboClassContentIconSchema = z.object({
    pluginIconSrc: z.string(),
    isIconChecked: z.boolean(),
});

export type ManaboClassContentIconDTO = z.infer<typeof ManaboClassContentIconSchema>;

export const ManaboClassContentDurationSchema = z.object({
    label: z.string(),
    value: z.string(),
});

export type ManaboClassContentDurationDTO = z.infer<typeof ManaboClassContentDurationSchema>;

export const ManaboClassContentFileSchema = z.object({
    fileName: z.string(),
    href: z.string(),
    icon: z.string(),
});

export type ManaboClassContentFileDTO = z.infer<typeof ManaboClassContentFileSchema>;

export const ManaboClassContentActionSchema = z.object({
    title: z.string(),
    href: z.string(),
});

export type ManaboClassContentActionDTO = z.infer<typeof ManaboClassContentActionSchema>;

export const ManaboClassContentAttachedFileSchema = z.object({
    comment: z.string(),
    files: z.array(ManaboClassContentFileSchema),
    duration: z.array(ManaboClassContentDurationSchema),
});

export type ManaboClassContentAttachedFileDTO = z.infer<typeof ManaboClassContentAttachedFileSchema>;

export const ManaboClassContentContentSchema = z.object({
    title: z.string(),
    contentId: z.string(),
    pluginKey: z.string(),
    duration: z.array(ManaboClassContentDurationSchema),
});

export type ManaboClassContentContentDTO = z.infer<typeof ManaboClassContentContentSchema>;

export const ManaboClassContentToggleAreaSchema = z.object({
    description: z.string(),
    isExpired: z.boolean(),
    isNotAvailableYet: z.boolean(),
    actions: z.array(ManaboClassContentActionSchema),
});

export const ManaboClassFileContentSchema = z.object({
    type: z.literal("file"),
    icon: ManaboClassContentIconSchema,
    attachedFile: ManaboClassContentAttachedFileSchema,
});

export type ManaboClassFileContentDTO = z.infer<typeof ManaboClassFileContentSchema>;

export const ManaboClassReportContentSchema = z.object({
    type: z.literal("report"),
    icon: ManaboClassContentIconSchema,
    content: ManaboClassContentContentSchema,
    toggleArea: ManaboClassContentToggleAreaSchema,
});

export type ManaboClassReportContentDTO = z.infer<typeof ManaboClassReportContentSchema>;

export const ManaboClassContentSchema = z.object({
    contents: z.array(z.union([ManaboClassFileContentSchema, ManaboClassReportContentSchema])),
});

export type ManaboClassContentDTO = z.infer<typeof ManaboClassContentSchema>;

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

export const ManaboClassSyllabusEvaluationSchema = z.object({
    type: z.string(),
    weight: z.string(),
});

export type ManaboClassSyllabusEvaluationDTO = z.infer<typeof ManaboClassSyllabusEvaluationSchema>;

export const ManaboClassSyllabusTextbookSchema = z.object({
    type: z.string(),
    title: z.string(),
});

export type ManaboClassSyllabusTextbookDTO = z.infer<typeof ManaboClassSyllabusTextbookSchema>;

export const ManaboClassSyllabusReferenceSchema = z.object({
    title: z.string(),
    code: z.string(),
});

export type ManaboClassSyllabusReferenceDTO = z.infer<typeof ManaboClassSyllabusReferenceSchema>;

export const ManaboClassSyllabusPlanItemSchema = z.object({
    no: z.number(),
    item: z.string(),
    content: z.string(),
});

export type ManaboClassSyllabusPlanItemDTO = z.infer<typeof ManaboClassSyllabusPlanItemSchema>;

export const ManaboClassSyllabusSchema = z.object({
    object: z.string(),
    goal: z.array(z.string()),
    method: z.string(),
    usedMethods: z.array(z.string()),
    evaluation: z.array(ManaboClassSyllabusEvaluationSchema),
    textbooks: z.array(ManaboClassSyllabusTextbookSchema),
    references: z.array(ManaboClassSyllabusReferenceSchema),
    officeHour: z.string(),
    plan: z.array(ManaboClassSyllabusPlanItemSchema),
    comment: z.string(),
    prePostStudy: z.string(),
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
