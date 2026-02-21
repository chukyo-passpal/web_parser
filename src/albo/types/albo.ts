import { z } from "zod";

export const AlboCalendarItemSchema = z.object({
    calendar_source_uuid: z.string(),
    summary: z.string(),
    description: z.string().nullable(),
    start_at: z.number(),
    end_at: z.number(),
    created_at: z.number(),
});

export type AlboCalendarItemDTO = z.infer<typeof AlboCalendarItemSchema>;

export const AlboCalendarSchema = z.object({
    is_successful: z.boolean(),
    code: z.number(),
    api_version: z.number(),
    gmt: z.number(),
    user: z.unknown().nullable(),
    result: z.object({
        page_total: z.number(),
        page_size: z.number(),
        item_count: z.number(),
        source_name: z.string(),
        items: z.array(AlboCalendarItemSchema),
    }),
});

export type AlboCalendarDTO = z.infer<typeof AlboCalendarSchema>;

export const AlboTimetableBadgeSchema = z.object({
    term: z.string(),
});

export type AlboTimetableBadgeDTO = z.infer<typeof AlboTimetableBadgeSchema>;

export const AlboTimetableItemSchema = z.object({
    uuid: z.string(),
    id: z.string(),
    execute_date: z.string(),
    day_of_week: z.number(),
    time_number: z.number(),
    class_id: z.string(),
    class_name: z.string(),
    term: z.string(),
    campus: z.string(),
    teacher: z.string(),
    room: z.string().nullable(),
    memo: z.string(),
    options: z.unknown().nullable(),
    created_at: z.number(),
    execute_school_year: z.string(),
    class_type: z.number(),
    memo_en: z.string().nullable(),
    options_en: z.unknown().nullable(),
    order: z.number(),
    badge: AlboTimetableBadgeSchema,
    term_en: z.string(),
    class_name_en: z.string(),
    campus_en: z.string(),
    cancels: z.array(z.unknown()),
    extras: z.array(z.unknown()),
    changes: z.array(z.unknown()),
});

export type AlboTimetableItemDTO = z.infer<typeof AlboTimetableItemSchema>;

export const AlboTimetableSchema = z.object({
    is_successful: z.boolean(),
    code: z.number(),
    api_version: z.number(),
    gmt: z.number(),
    user: z.unknown().nullable(),
    result: z.object({
        time_table_type: z.string(),
        page_total: z.number(),
        page_size: z.number(),
        item_count: z.number(),
        items: z.array(AlboTimetableItemSchema),
    }),
});

export type AlboTimetableDTO = z.infer<typeof AlboTimetableSchema>;

export const AlboInformationCategorySchema = z.object({
    uuid: z.string(),
    name: z.string(),
    name_en: z.string().nullable(),
    description: z.string().nullable(),
    description_en: z.string().nullable(),
    order: z.number(),
    is_for_guest: z.boolean(),
    created_by: z.string(),
    updated_by: z.string().nullable(),
    created_at: z.number(),
    updated_at: z.number(),
});

export type AlboInformationCategoryDTO = z.infer<typeof AlboInformationCategorySchema>;

export const AlboInformationFileSchema = z.object({
    uuid: z.string(),
    file_name: z.string(),
    mime_type: z.string(),
    is_thumb_exists: z.boolean(),
    created_by: z.string(),
    created_at: z.number(),
});

export type AlboInformationFileDTO = z.infer<typeof AlboInformationFileSchema>;

export const AlboInformationItemSchema = z.object({
    uuid: z.string(),
    publish_from: z.string(),
    publish_from_en: z.string().nullable(),
    publish_department_en: z.string().nullable(),
    publish_start_at: z.number(),
    publish_end_at: z.number(),
    title: z.string(),
    title_en: z.string().nullable(),
    content: z.string(),
    content_en: z.string().nullable(),
    priority: z.number(),
    event_title: z.string().nullable(),
    event_title_en: z.string().nullable(),
    event_start_at: z.number().nullable(),
    event_end_at: z.number().nullable(),
    is_send_mail_notification: z.number(),
    mail_from: z.string().nullable(),
    options: z.unknown().nullable(),
    created_by: z.string(),
    updated_by: z.string().nullable(),
    created_at: z.number(),
    is_template: z.number(),
    is_public: z.boolean(),
    is_read: z.boolean(),
    is_pinned: z.boolean(),
    is_reacted_good: z.boolean(),
    good_count: z.number(),
    category: AlboInformationCategorySchema,
    files: z.array(AlboInformationFileSchema).nullable(),
    personal_files: z.array(AlboInformationFileSchema).nullable(),
    images: z.array(AlboInformationFileSchema).nullable(),
});

export type AlboInformationItemDTO = z.infer<typeof AlboInformationItemSchema>;

export const AlboInformationSchema = z.object({
    is_successful: z.boolean(),
    code: z.number(),
    api_version: z.number(),
    gmt: z.number(),
    user: z.unknown().nullable(),
    result: z.object({
        page_total: z.number(),
        page_size: z.number(),
        item_count: z.number(),
        items: z.array(AlboInformationItemSchema),
    }),
});

export type AlboInformationDTO = z.infer<typeof AlboInformationSchema>;

export const AlboPersonalAuthProfileSchema = z.object({
    uuid: z.string(),
    name: z.string(),
    created_at: z.number(),
    updated_at: z.number().nullable(),
});

export type AlboPersonalAuthProfileDTO = z.infer<typeof AlboPersonalAuthProfileSchema>;

export const AlboPersonalGroupSchema = z.object({
    group_index: z.string(),
    next_group_index: z.string(),
    orig_group_index: z.string(),
    uuid: z.string(),
    name: z.string(),
    name_en: z.string().nullable(),
    is_authority: z.boolean(),
    order: z.number(),
    is_active: z.number(),
    is_shown_in_signup: z.number(),
    created_at: z.number(),
    updated_at: z.number(),
    full_name: z.string(),
    display_name: z.string(),
    display_name_en: z.string(),
});

export type AlboPersonalGroupDTO = z.infer<typeof AlboPersonalGroupSchema>;

export const AlboPersonalUserSchema = z.object({
    uuid: z.string(),
    personal_id: z.string(),
    name: z.string(),
    name_kana: z.string(),
    name_alphabet: z.string(),
    email: z.string(),
    locale: z.string(),
    option_1: z.string().nullable(),
    option_2: z.string().nullable(),
    option_3: z.string().nullable(),
    option_4: z.string().nullable(),
    option_5: z.string().nullable(),
    option_6: z.string().nullable(),
    option_7: z.string().nullable(),
    option_8: z.string().nullable(),
    option_9: z.string().nullable(),
    option_10: z.string().nullable(),
    approval_status: z.string().nullable(),
    is_user_enabled: z.boolean(),
    is_login_enabled: z.boolean(),
    is_guest: z.boolean(),
    start_at: z.number(),
    end_at: z.number(),
    memo: z.string().nullable(),
    admin_memo: z.string().nullable(),
    is_not_delete_csv: z.boolean(),
    created_at: z.number(),
    updated_at: z.number(),
    user_id: z.string(),
    auth_profiles: AlboPersonalAuthProfileSchema,
    groups: z.array(AlboPersonalGroupSchema),
    has_answer_force_questionnaire: z.boolean(),
    has_force_questionnaire: z.boolean(),
    sub_email_addresses: z.array(z.string()),
    display_group_names: z.array(z.string()),
    display_group_names_en: z.array(z.string()),
    portrait: z.string().nullable(),
    permission: z.string(),
    permission_unit: z.array(z.unknown()),
    has_local_auth: z.boolean(),
    affiliated_groups: z.unknown().nullable(),
});

export type AlboPersonalUserDTO = z.infer<typeof AlboPersonalUserSchema>;

export const AlboPersonalSchema = z.object({
    is_successful: z.boolean(),
    code: z.number(),
    api_version: z.number(),
    gmt: z.number(),
    user: AlboPersonalUserSchema,
    result: z.object({
        login: z.string(),
        message: z.string(),
        login_message: z.string().nullable(),
    }),
});

export type AlboPersonalDTO = z.infer<typeof AlboPersonalSchema>;
