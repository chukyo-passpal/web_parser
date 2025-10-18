import { load } from "cheerio";

import {
    ManaboClassContentSchema,
    ManaboClassDirectorySchema,
    ManaboClassEntrySchema,
    ManaboClassNewsSchema,
    ManaboClassNotAttendContentSchema,
    ManaboClassQuizResultSchema,
    ManaboClassSyllabusSchema,
    type ManaboClassContentDTO,
    type ManaboClassDirectoryDTO,
    type ManaboClassEntryDTO,
    type ManaboClassNewsDTO,
    type ManaboClassNotAttendContentDTO,
    type ManaboClassQuizResultDTO,
    type ManaboClassSyllabusDTO,
} from "../schemas/manaboClass";
import type { ZodSafeParseResult } from "zod";

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

export const parseManaboClassDirectory = (html: string): ZodSafeParseResult<ManaboClassDirectoryDTO> => {
    const $ = load(html);
    const classNode = $(".class-top-directory .x-content-drop").first();
    const classId = classNode.attr("class_id") ?? "";
    const className = normalizeWhitespace($(".class-top-directory .span-class-name").first().text());
    const directories = $(".div-panel-directory li[directory_id]")
        .map((_, element) => {
            const node = $(element);
            const directoryId = node.attr("directory_id") ?? "";
            const title = normalizeWhitespace(node.find(".x-directory-name").first().text());
            return {
                directoryId,
                title,
            };
        })
        .get()
        .filter((directory) => directory.directoryId.length > 0 && directory.title.length > 0);

    return ManaboClassDirectorySchema.safeParse({
        classId,
        className,
        directories,
    });
};

export const parseManaboClassContent = (html: string): ZodSafeParseResult<ManaboClassContentDTO> => {
    const $ = load(html);
    const items: {
        contentId: string;
        pluginKey: string;
        title: string;
        iconSrc: string | null;
        descriptionHtml: string | null;
        action: {
            label: string;
            url: string;
        } | null;
    }[] = [];

    $(".table-class-content tbody tr").each((_, row) => {
        const rowElement = $(row);
        const anchor = rowElement.find("a.a-content-open").first();
        if (!anchor.length) {
            return;
        }

        const contentId = anchor.attr("content_id") ?? "";
        const pluginKey = anchor.attr("plugin_key") ?? "";
        const title = normalizeWhitespace(anchor.text());
        const iconSrc = rowElement.find(".plugin-icon").attr("src") ?? null;
        const toggleRow = rowElement.next(".toggle-area");
        const descriptionHtml = toggleRow.find(".description").html()?.trim() ?? null;
        const actionButton = toggleRow.find(".confirm a.btn").first();
        const action =
            actionButton.length > 0
                ? {
                      label: normalizeWhitespace(actionButton.text()),
                      url: actionButton.attr("href") ?? "",
                  }
                : null;

        items.push({
            contentId,
            pluginKey,
            title,
            iconSrc,
            descriptionHtml,
            action,
        });
    });

    return ManaboClassContentSchema.safeParse({
        items,
    });
};

export const parseManaboClassNotAttendContent = (html: string): ZodSafeParseResult<ManaboClassNotAttendContentDTO> => {
    const contentHtml = html.trim();
    return ManaboClassNotAttendContentSchema.safeParse({
        contentHtml,
    });
};

export const parseManaboClassEntry = (html: string): ZodSafeParseResult<ManaboClassEntryDTO> => {
    const $ = load(html);
    const rows = $("table.table-default tbody tr")
        .map((_, row) => {
            const cells = $(row).find("td");
            const directory = normalizeWhitespace(cells.eq(0).text());
            const lectureDateRaw = normalizeWhitespace(cells.eq(1).text());
            const lectureDate = lectureDateRaw.length ? lectureDateRaw : null;
            const status = normalizeWhitespace(cells.eq(2).text());
            return {
                directory,
                lectureDate,
                status,
            };
        })
        .get();

    return ManaboClassEntrySchema.safeParse({
        rows,
    });
};

export const parseManaboClassNews = (html: string): ZodSafeParseResult<ManaboClassNewsDTO> => {
    const $ = load(html);
    const items = $("dl.x-openclose")
        .map((_, element) => {
            const dl = $(element);
            const title = normalizeWhitespace(dl.find("dt b").first().text());
            const bodyHtml = dl.find("dd").first().html()?.trim() ?? "";
            return {
                id: dl.attr("id") ?? null,
                title,
                bodyHtml,
            };
        })
        .get();

    return ManaboClassNewsSchema.safeParse({
        items,
    });
};

export const parseManaboClassSyllabus = (html: string): ZodSafeParseResult<ManaboClassSyllabusDTO> => {
    const $ = load(html);
    const title = normalizeWhitespace($(".panel-heading").first().text());

    const sections: { label: string; valueHtml: string }[] = [];
    const lessonPlan: { number: string; topic: string; detail: string }[] = [];

    $(".table.table-default > tr").each((_, row) => {
        const rowElement = $(row);
        const label = normalizeWhitespace(rowElement.find("th").first().text());
        const valueCell = rowElement.find("td").first();
        const valueHtml = valueCell.html()?.trim() ?? "";

        if (label === "授業計画") {
            valueCell.find("table.table-bordered tbody tr").each((__, planRow) => {
                const planCells = $(planRow).find("td");
                lessonPlan.push({
                    number: normalizeWhitespace(planCells.eq(0).text()),
                    topic: normalizeWhitespace(planCells.eq(1).text()),
                    detail: normalizeWhitespace(planCells.eq(2).text()),
                });
            });
        }

        sections.push({
            label,
            valueHtml,
        });
    });

    return ManaboClassSyllabusSchema.safeParse({
        title,
        sections,
        lessonPlan,
    });
};

export const parseManaboClassQuizResult = (html: string): ZodSafeParseResult<ManaboClassQuizResultDTO> => {
    const $ = load(html);
    const scoreText = normalizeWhitespace($(".text-center .Red b").first().text());
    const totalText = normalizeWhitespace($(".text-center").first().text()).split("/")[1] ?? "0";
    const obtained = Number(scoreText.replace(/[^\d]/g, "")) || 0;
    const total = Number(totalText.replace(/[^\d]/g, "")) || 0;
    const totalItemsText = normalizeWhitespace($(".row.margin-top-md .col-sm-2").first().text());

    let currentPage = "";

    const questions = $("table.table-default-grade tbody tr")
        .map((_, row) => {
            const rowElement = $(row);
            const cells = rowElement.find("td");
            let cellIndex = 0;

            if (cells.eq(cellIndex).attr("rowspan")) {
                currentPage = normalizeWhitespace(cells.eq(cellIndex).text());
                cellIndex += 1;
            } else if (cells.length === 7) {
                currentPage = normalizeWhitespace(cells.eq(cellIndex).text());
                cellIndex += 1;
            }

            const questionNumber = normalizeWhitespace(cells.eq(cellIndex).text());
            cellIndex += 1;

            const questionText = normalizeWhitespace(cells.eq(cellIndex).find(".div-instructions").text() || cells.eq(cellIndex).text());
            cellIndex += 1;

            const correctAnswer = normalizeWhitespace(cells.eq(cellIndex).text());
            cellIndex += 1;

            const studentAnswer = normalizeWhitespace(cells.eq(cellIndex).text());
            cellIndex += 1;

            const resultCell = cells.eq(cellIndex);
            const resultIcon = resultCell.find("img").first();
            const resultText = normalizeWhitespace(resultCell.text());
            cellIndex += 1;

            const teacherComment = normalizeWhitespace(cells.eq(cellIndex).text());
            const resultAltRaw = normalizeWhitespace(resultIcon.attr("alt") ?? "");

            return {
                page: currentPage,
                questionNumber,
                questionText,
                correctAnswer,
                studentAnswer,
                resultIconAlt: resultAltRaw.length ? resultAltRaw : null,
                resultIconSrc: resultIcon.attr("src") ?? null,
                resultText: resultText.length ? resultText : null,
                teacherComment: teacherComment.length ? teacherComment : null,
            };
        })
        .get();

    return ManaboClassQuizResultSchema.safeParse({
        score: {
            obtained,
            total,
        },
        totalItemsText: totalItemsText.length ? totalItemsText : null,
        questions,
    });
};
