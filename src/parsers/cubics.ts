import { load } from "cheerio";
import { CubicsAsTimetableSchema, type CubicsAsTimetableDTO } from "../schemas/cubics";
import type { ZodSafeParseResult } from "zod";

export const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

export const extractFirstQuotedValue = (raw: string | undefined | null): string | null => {
    if (!raw) {
        return null;
    }
    const match = raw.match(/'([^']+)'/);
    return match ? match[1] ?? null : null;
};

export const parseCubicsAsTimetable = (html: string): ZodSafeParseResult<CubicsAsTimetableDTO> => {
    const $ = load(html);

    const studentTable = $("table.output").first();
    const studentRows = studentTable.find("tr");

    const row1Cells = studentRows.eq(0).find("td");
    const row2Cells = studentRows.eq(1).find("td");
    const row3Cells = studentRows.eq(2).find("td");
    const row4Cells = studentRows.eq(3).find("td");

    const student = {
        id: normalizeWhitespace(row1Cells.eq(0).text()),
        name: normalizeWhitespace(row1Cells.eq(1).text()),
        division: normalizeWhitespace(row2Cells.eq(0).text()),
        affiliation: normalizeWhitespace(row2Cells.eq(1).text()),
        status: normalizeWhitespace(row2Cells.eq(2).text()),
        className: normalizeWhitespace(row2Cells.eq(3).text()),
        faculty: normalizeWhitespace(row3Cells.eq(0).text()),
        department: normalizeWhitespace(row3Cells.eq(1).text()),
        course: normalizeWhitespace(row3Cells.eq(2).text()),
        address: normalizeWhitespace(row4Cells.eq(0).text()),
    };

    const periodRange = normalizeWhitespace($("input[name='lblSpcfProd']").attr("value") ?? $("div.searcharea ul li").first().text());

    const curriculumTable = $("table.output_curriculum");
    const headerCells = curriculumTable.find("tr").first().find("th").slice(1);

    const days = headerCells
        .map((_, element) => {
            const text = normalizeWhitespace($(element).text());
            const segments = text.split(" ").filter((segment) => segment.length > 0);
            return {
                label: segments[0] ?? "",
                date: segments[1] ?? "",
            };
        })
        .get();

    const periods = curriculumTable
        .find("tr")
        .slice(1)
        .map((_, row) => {
            const periodLabel = normalizeWhitespace($(row).find("th").first().text());
            const slots = $(row)
                .find("td")
                .map((__, cell) => {
                    const cellElement = $(cell);
                    const lessonCode = cellElement.find('input[name$=".hdnLsnCd1"]').attr("value") ?? null;
                    const lessonYear = cellElement.find('input[name$=".hdnLsnOpcFcy1"]').attr("value") ?? null;
                    const termCode = cellElement.find('input[name$=".hdnTacTrmCd1"]').attr("value") ?? null;
                    const timetableCode = cellElement.find('input[name$=".hdnTmtxCd"]').attr("value") ?? null;
                    const optionDate = cellElement.find('input[name$=".hdnOpcDt"]').attr("value") ?? null;
                    const detailOnclick = cellElement
                        .find("a")
                        .filter((___, anchor) => {
                            const onclick = $(anchor).attr("onclick") ?? "";
                            return onclick.includes("execPopupWindowOpen");
                        })
                        .first()
                        .attr("onclick");

                    const infoAnchors = cellElement.find("a.chiphelp");
                    const classroom = normalizeWhitespace(infoAnchors.eq(0).text());
                    const subject = normalizeWhitespace(infoAnchors.eq(1).text());

                    const slot = {
                        classroom: classroom.length ? classroom : null,
                        subject: subject.length ? subject : null,
                        detailUrl: extractFirstQuotedValue(detailOnclick),
                        lessonCode,
                        lessonYear,
                        termCode,
                        timetableCode,
                        optionDate,
                    };

                    if (!slot.classroom && !slot.subject && !slot.detailUrl && !slot.lessonCode) {
                        return {
                            classroom: null,
                            subject: null,
                            detailUrl: null,
                            lessonCode: null,
                            lessonYear: null,
                            termCode: null,
                            timetableCode: null,
                            optionDate: null,
                        };
                    }

                    return slot;
                })
                .get();

            return {
                periodLabel,
                slots,
            };
        })
        .get();

    return CubicsAsTimetableSchema.safeParse({
        student,
        periodRange,
        days,
        periods,
    });
};
