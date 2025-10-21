import { loadDocument, queryAll, queryOne, getTextContent } from "../../common/dom";
import { ManaboNewsSchema, type ManaboNewsDTO } from "../types/manaboNews";
import type { ZodSafeParseResult } from "zod";

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

export const parseManaboNews = (html: string): ZodSafeParseResult<ManaboNewsDTO> => {
    const document = loadDocument(html);

    const rows = queryAll(".table-info tbody tr", document);
    const items: { text: string }[] = [];
    let message: string | null = null;

    rows.forEach((row) => {
        const text = normalizeWhitespace(getTextContent(row));
        if (!text.length) {
            return;
        }
        if (queryOne("a", row)) {
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
