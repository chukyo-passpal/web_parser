import { load } from "cheerio";
import type { Cheerio, CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import { ManaboTimetableSchema, type ManaboTimetableDTO, type ManaboTimetablePeriodDTO, type ManaboTimetableSlotDTO } from "../schemas/manaboTimetable";

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

const buildSlot = (cell: Cheerio<Element>, day: string): ManaboTimetableSlotDTO => {
    const anchor = cell.find("div.student a").first();
    if (!anchor.length) {
        return {
            day,
            className: null,
            teacher: null,
            href: null,
        };
    }

    const className = normalizeWhitespace(anchor.find("b").text());
    const teacher = normalizeWhitespace(anchor.clone().find("b").remove().end().text());

    return {
        day,
        className: className.length ? className : null,
        teacher: teacher.length ? teacher : null,
        href: anchor.attr("href") ?? null,
    };
};

const buildPeriod = (row: Cheerio<Element>, days: string[], $: CheerioAPI): ManaboTimetablePeriodDTO => {
    const periodLabel = normalizeWhitespace(row.find("th.time").first().text());
    const slots = row
        .find("td")
        .map((index, cell) => buildSlot($(cell), days[index] ?? ""))
        .get();

    return {
        period: periodLabel,
        slots,
    };
};

export const parseManaboTimetable = (html: string): ManaboTimetableDTO => {
    const $ = load(html);

    const title = normalizeWhitespace($("#time_table_name").text());

    const termAnchors = $(".calendar .nav-tabs")
        .find("a.a-load-timetable[archive_id]")
        .map((_, element) => {
            const anchor = $(element);
            const enclosingLi = anchor.closest("li");
            return {
                archiveId: anchor.attr("archive_id") ?? "",
                label: normalizeWhitespace(anchor.text()),
                active: enclosingLi.hasClass("active"),
            };
        })
        .get();

    const viewModes = $(".panel-body .text-right")
        .find("a.a-load-timetable")
        .map((_, element) => {
            const anchor = $(element);
            return {
                archiveId: anchor.attr("archive_id") ?? "",
                mode: anchor.attr("mode") ?? null,
                label: normalizeWhitespace(anchor.text()),
                active: anchor.hasClass("active"),
            };
        })
        .get();

    const table = $(".table-calendar");
    const days = table
        .find("thead tr th.data")
        .map((_, element) => normalizeWhitespace($(element).text()))
        .get();

    const periods = table
        .find("tbody tr")
        .map((_, row) => buildPeriod($(row), days, $))
        .get();

    return ManaboTimetableSchema.parse({
        title,
        terms: termAnchors,
        viewModes,
        days,
        periods,
    });
};
