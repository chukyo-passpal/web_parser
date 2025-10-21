import { loadDocument, queryAll, queryOne, getAttribute, getTextContent } from "../../common/dom";
import { ManaboEntryFormSchema, ManaboEntryResponseSchema, type ManaboEntryFormDTO, type ManaboEntryResponseDTO } from "../types/manaboEntry";
import type { ZodSafeParseResult } from "zod";

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

export const parseManaboEntryForm = (html: string): ZodSafeParseResult<ManaboEntryFormDTO> => {
    const document = loadDocument(html);
    const form = queryOne("#form-entry", document);

    const messages = form
        ? queryAll("p", form)
              .map((element) => normalizeWhitespace(getTextContent(element)))
              .filter((message) => message.length > 0)
        : [];

    return ManaboEntryFormSchema.safeParse({
        action: getAttribute(queryOne('input[name="action"]', form ?? null), "value") ?? "",
        classId: getAttribute(queryOne('input[name="class_id"]', form ?? null), "value") ?? "",
        directoryId: getAttribute(queryOne('input[name="directory_id"]', form ?? null), "value") ?? "",
        entryId: getAttribute(queryOne('input[name="entry_id"]', form ?? null), "value") ?? "",
        uniqid: getAttribute(queryOne('input[name="uniqid"]', form ?? null), "value") ?? "",
        messages,
    });
};

export const parseManaboEntryResponse = (json: string): ZodSafeParseResult<ManaboEntryResponseDTO> => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(json);
    } catch {
        parsed = undefined;
    }
    return ManaboEntryResponseSchema.safeParse(parsed);
};
