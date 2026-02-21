import type { ZodSafeParseResult } from "zod";
import {
    AlboCalendarSchema,
    type AlboCalendarDTO,
    AlboInformationSchema,
    type AlboInformationDTO,
    AlboPersonalSchema,
    type AlboPersonalDTO,
    AlboTimetableSchema,
    type AlboTimetableDTO,
} from "../types/albo";

const parseAlboJson = <T>(input: string, schema: { safeParse: (value: unknown) => ZodSafeParseResult<T> }): ZodSafeParseResult<T> => {
    try {
        return schema.safeParse(JSON.parse(input));
    } catch {
        return schema.safeParse(undefined);
    }
};

export const parseAlboCalendar = (json: string): ZodSafeParseResult<AlboCalendarDTO> => parseAlboJson(json, AlboCalendarSchema);

export const parseAlboInformation = (json: string): ZodSafeParseResult<AlboInformationDTO> => parseAlboJson(json, AlboInformationSchema);

export const parseAlboPersonal = (json: string): ZodSafeParseResult<AlboPersonalDTO> => parseAlboJson(json, AlboPersonalSchema);

export const parseAlboTimetable = (json: string): ZodSafeParseResult<AlboTimetableDTO> => parseAlboJson(json, AlboTimetableSchema);
