import { loadDocument, queryAll, queryOne, getAttribute, getTextContent, elementHasClass, closest, isElement } from "../../common/dom";
import type { Element, AnyNode } from "domhandler";
import { ManaboTimetableSchema, type ManaboTimetableDTO, type ManaboTimetablePeriodDTO, type ManaboTimetableSlotDTO } from "../types/manaboTimetable";
import type { ZodSafeParseResult } from "zod";

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

const collectTextExcluding = (nodes: AnyNode[], selector: (node: AnyNode) => boolean): string =>
    normalizeWhitespace(
        nodes
            .filter((node) => !selector(node))
            .map((node) => getTextContent(node))
            .join(" ")
    );

const buildSlot = (cell: Element, day: string): ManaboTimetableSlotDTO => {
    const anchor = queryOne("div.student a", cell);
    if (!anchor) {
        return {
            day,
            className: null,
            teacher: null,
            href: null,
        };
    }

    const classNameElement = queryOne("b", anchor);
    const classNameText = normalizeWhitespace(classNameElement ? getTextContent(classNameElement) : "");
    const teacherText = collectTextExcluding(anchor.children ?? [], (node) => isElement(node) && node.name === "b");
    const hasStatusLabel = !!queryOne("small.label", anchor);
    const teacherValue = hasStatusLabel ? null : teacherText.length ? teacherText : null;

    return {
        day,
        className: classNameText.length ? classNameText : null,
        teacher: teacherValue,
        href: getAttribute(anchor, "href"),
    };
};

const buildPeriod = (row: Element, days: string[]): ManaboTimetablePeriodDTO => {
    const periodLabel = normalizeWhitespace(getTextContent(queryOne("th.time", row)));
    const cells = queryAll("td", row);
    const slots = cells.map((cell, index) => buildSlot(cell, days[index] ?? ""));

    return {
        period: periodLabel,
        slots,
    };
};

export const parseManaboTimetable = (html: string): ZodSafeParseResult<ManaboTimetableDTO> => {
    const document = loadDocument(html);

    const title = normalizeWhitespace(getTextContent(queryOne("#time_table_name", document)));

    const termAnchors = queryAll(".calendar .nav-tabs a.a-load-timetable[archive_id]", document).map((anchor) => {
        const enclosingLi = closest(anchor, "li");
        return {
            archiveId: getAttribute(anchor, "archive_id") ?? "",
            label: normalizeWhitespace(getTextContent(anchor)),
            active: elementHasClass(anchor, "active") || (enclosingLi ? elementHasClass(enclosingLi, "active") : false),
        };
    });

    const viewModes = queryAll(".panel-body .text-right a.a-load-timetable", document).map((anchor) => ({
        archiveId: getAttribute(anchor, "archive_id") ?? "",
        mode: getAttribute(anchor, "mode"),
        label: normalizeWhitespace(getTextContent(anchor)),
        active: elementHasClass(anchor, "active"),
    }));

    const table = queryOne(".table-calendar", document);
    const dayHeaders = table ? queryAll("thead tr th.data", table) : [];
    const days = dayHeaders.map((element) => normalizeWhitespace(getTextContent(element)));

    const periodRows = table ? queryAll("tbody tr", table) : [];
    const periods = periodRows.map((row) => buildPeriod(row, days));

    return ManaboTimetableSchema.safeParse({
        title,
        terms: termAnchors,
        viewModes,
        days,
        periods,
    });
};
