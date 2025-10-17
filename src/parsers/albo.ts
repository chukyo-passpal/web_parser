import { type CheerioAPI, load } from "cheerio";
import type { Element } from "domhandler";
import { type CubicsPtNewsEntryDTO, type CubicsPtNewsDTO, CubicsPtNewsSchema } from "../schemas/albo";
import { normalizeWhitespace, extractFirstQuotedValue } from "./cubics";

const parseNewsEntry = (row: Element, $: CheerioAPI): CubicsPtNewsEntryDTO | null => {
    const categoryAlt = $(row).find("th.category img").attr("alt") ?? null;
    const statusAlt = $(row).find("td.status img").attr("alt") ?? null;
    const statusSrc = $(row).find("td.status img").attr("src") ?? null;
    const headlineAnchor = $(row).find("td.headline a").first();

    if (!headlineAnchor.length) {
        return null;
    }

    const title = normalizeWhitespace(headlineAnchor.text());
    const onclick = headlineAnchor.attr("onclick") ?? "";
    const link = extractFirstQuotedValue(onclick) ?? headlineAnchor.attr("href") ?? null;

    return {
        category: categoryAlt,
        status: statusAlt ?? statusSrc,
        title,
        link,
    };
};

export const parseCubicsPtNews = (html: string): CubicsPtNewsDTO => {
    const $ = load(html);

    const tabs = $("#tab_element")
        .find("li")
        .map((_, tab) => {
            const tabElement = $(tab);
            const anchor = tabElement.find("a").first();
            const targetId = anchor.attr("href")?.replace("#", "") ?? "";
            const title = normalizeWhitespace(anchor.text());

            const tableRows = $(`#${targetId}`)
                .find("table.tab-newslist tr")
                .map((__, row) => parseNewsEntry(row, $))
                .get()
                .filter((entry): entry is CubicsPtNewsEntryDTO => entry !== null);

            return {
                id: targetId,
                title,
                entries: tableRows,
                active: tabElement.hasClass("selected"),
            };
        })
        .get();

    const selectedTab = tabs.find((tab) => tab.active);

    return CubicsPtNewsSchema.parse({
        selectedTabId: selectedTab ? selectedTab.id : null,
        tabs: tabs.map((tab) => ({
            id: tab.id,
            title: tab.title,
            entries: tab.entries,
        })),
    });
};
