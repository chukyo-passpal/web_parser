import { z } from "zod";

export const ManaboMailListPageSchema = z.object({
    label: z.string(),
    page: z.string(),
    active: z.boolean(),
});

export type ManaboMailListPageDTO = z.infer<typeof ManaboMailListPageSchema>;

export const ManaboReceivedMailItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    statusIconAlt: z.string().nullable(),
    statusIconSrc: z.string().nullable(),
    mailLink: z.string().nullable(),
    senderName: z.string().nullable(),
    senderImage: z.string().nullable(),
    receivedAt: z.string(),
});

export type ManaboReceivedMailItemDTO = z.infer<typeof ManaboReceivedMailItemSchema>;

export const ManaboReceivedMailSchema = z.object({
    summary: z.string().nullable(),
    pages: z.array(ManaboMailListPageSchema),
    mails: z.array(ManaboReceivedMailItemSchema),
});

export type ManaboReceivedMailDTO = z.infer<typeof ManaboReceivedMailSchema>;

export const ManaboSentMailItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    statusIconAlt: z.string().nullable(),
    statusIconSrc: z.string().nullable(),
    mailLink: z.string().nullable(),
    recipientName: z.string().nullable(),
    recipientImage: z.string().nullable(),
    sentAt: z.string(),
    unreadCount: z.number(),
});

export type ManaboSentMailItemDTO = z.infer<typeof ManaboSentMailItemSchema>;

export const ManaboSentMailSchema = z.object({
    summary: z.string().nullable(),
    mails: z.array(ManaboSentMailItemSchema),
});

export type ManaboSentMailDTO = z.infer<typeof ManaboSentMailSchema>;

export const ManaboMailViewSchema = z.object({
    title: z.string(),
    replyMailId: z.string().nullable(),
    fromMemberId: z.string().nullable(),
    nextMailId: z.string().nullable(),
    senderName: z.string(),
    senderImage: z.string().nullable(),
    sentAt: z.string(),
    bodyHtml: z.string(),
});

export type ManaboMailViewDTO = z.infer<typeof ManaboMailViewSchema>;

export const ManaboMailSendSchema = z.object({
    modalTitle: z.string(),
    form: z.object({
        action: z.string(),
        replyMailId: z.string().nullable(),
        signature: z.string().nullable(),
        csrfToken: z.string(),
    }),
    submitLabel: z.string(),
});

export type ManaboMailSendDTO = z.infer<typeof ManaboMailSendSchema>;

export const ManaboMailMemberSchema = z.object({
    members: z.array(
        z.object({
            memberId: z.string(),
            name: z.string(),
            image: z.string().nullable(),
        })
    ),
});

export type ManaboMailMemberDTO = z.infer<typeof ManaboMailMemberSchema>;
