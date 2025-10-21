import { loadDocument, queryAll, queryOne, getAttribute, getTextContent } from "../../common/dom";
import type { Element } from "../../common/dom";
import { CubicsAsTimetableSchema, type CubicsAsTimetableDTO } from "../types/cubics";
import type { ZodSafeParseResult } from "zod";
import { normalizeWhitespace, extractFirstQuotedValue } from "../../common/utils";

export const parseCubicsAsTimetable = (html: string): ZodSafeParseResult<CubicsAsTimetableDTO> => {
    const document = loadDocument(html);

    const studentTable = queryOne("table.output", document);
    const studentRows = studentTable ? queryAll("tr", studentTable) : [];

    const row1Cells = studentRows[0] ? queryAll("td", studentRows[0]) : [];
    const row2Cells = studentRows[1] ? queryAll("td", studentRows[1]) : [];
    const row3Cells = studentRows[2] ? queryAll("td", studentRows[2]) : [];
    const row4Cells = studentRows[3] ? queryAll("td", studentRows[3]) : [];

    const getCellText = (cells: Element[], index: number): string => normalizeWhitespace(getTextContent(cells[index] ?? null));

    const student = {
        id: getCellText(row1Cells, 0),
        name: getCellText(row1Cells, 1),
        division: getCellText(row2Cells, 0),
        affiliation: getCellText(row2Cells, 1),
        status: getCellText(row2Cells, 2),
        className: getCellText(row2Cells, 3),
        faculty: getCellText(row3Cells, 0),
        department: getCellText(row3Cells, 1),
        course: getCellText(row3Cells, 2),
        address: getCellText(row4Cells, 0),
    };

    const periodInput = queryOne("input[name='lblSpcfProd']", document);
    const fallbackPeriod = queryOne("div.searcharea ul li", document);
    const periodRangeRaw = getAttribute(periodInput, "value") ?? normalizeWhitespace(getTextContent(fallbackPeriod));
    const periodRange = normalizeWhitespace(periodRangeRaw);

    const curriculumTable = queryOne("table.output_curriculum", document);
    const headerRow = curriculumTable ? queryOne("tr", curriculumTable) : null;
    const headerCells = headerRow ? queryAll("th", headerRow).slice(1) : [];

    const days = headerCells.map((element) => {
        const text = normalizeWhitespace(getTextContent(element));
        const segments = text.split(" ").filter((segment) => segment.length > 0);
        return {
            label: segments[0] ?? "",
            date: segments[1] ?? "",
        };
    });

    const periodRows = curriculumTable ? queryAll("tr", curriculumTable).slice(1) : [];

    const periods = periodRows.map((row) => {
        const periodLabel = normalizeWhitespace(getTextContent(queryOne("th", row)));
        const cells = queryAll("td", row);

        const slots = cells.map((cell) => {
            const lessonCode = getAttribute(queryOne('input[name$=".hdnLsnCd1"]', cell), "value");
            const lessonYear = getAttribute(queryOne('input[name$=".hdnLsnOpcFcy1"]', cell), "value");
            const termCode = getAttribute(queryOne('input[name$=".hdnTacTrmCd1"]', cell), "value");
            const timetableCode = getAttribute(queryOne('input[name$=".hdnTmtxCd"]', cell), "value");
            const optionDate = getAttribute(queryOne('input[name$=".hdnOpcDt"]', cell), "value");

            const detailAnchor = queryAll("a", cell).find((anchor) => (getAttribute(anchor, "onclick") ?? "").includes("execPopupWindowOpen"));
            const detailOnclick = detailAnchor ? getAttribute(detailAnchor, "onclick") ?? "" : "";

            const infoAnchors = queryAll("a.chiphelp", cell);
            const classroom = normalizeWhitespace(getTextContent(infoAnchors[0] ?? null));
            const subject = normalizeWhitespace(getTextContent(infoAnchors[1] ?? null));

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
        });

        return {
            periodLabel,
            slots,
        };
    });

    return CubicsAsTimetableSchema.safeParse({
        student,
        periodRange,
        days,
        periods,
    });
};
