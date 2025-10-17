import { load } from "cheerio";
import { ManaboEntryFormSchema, ManaboEntryResponseSchema, type ManaboEntryFormDTO, type ManaboEntryResponseDTO } from "../schemas/manaboEntry";

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

export const parseManaboEntryForm = (html: string): ManaboEntryFormDTO => {
    const $ = load(html);
    const form = $("#form-entry");
    const messages = form
        .find("p")
        .map((_, element) => normalizeWhitespace($(element).text()))
        .get()
        .filter((message) => message.length > 0);

    return ManaboEntryFormSchema.parse({
        action: form.find('input[name="action"]').attr("value") ?? "",
        classId: form.find('input[name="class_id"]').attr("value") ?? "",
        directoryId: form.find('input[name="directory_id"]').attr("value") ?? "",
        entryId: form.find('input[name="entry_id"]').attr("value") ?? "",
        uniqid: form.find('input[name="uniqid"]').attr("value") ?? "",
        messages,
    });
};

export const parseManaboEntryResponse = (json: string): ManaboEntryResponseDTO => {
    const parsed = JSON.parse(json);
    return ManaboEntryResponseSchema.parse(parsed);
};
