import { load } from "cheerio";
import { ManaboNewsSchema, type ManaboNewsDTO } from "../schemas/manaboNews";
import type { ZodSafeParseResult } from "zod";

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

export const parseManaboNews = (html: string): ZodSafeParseResult<ManaboNewsDTO> => {
    const $ = load(html);

    const rows = $(".table-info tbody tr");
    const items: { text: string }[] = [];
    let message: string | null = null;

    rows.each((_, row) => {
        const rowElement = $(row);
        const text = normalizeWhitespace(rowElement.text());
        if (!text.length) {
            return;
        }
        if (rowElement.find("a").length) {
            items.push({ text });
        } else {
            message = text;
        }
    });

    return ManaboNewsSchema.safeParse({
        message,
        items,
    });
};
