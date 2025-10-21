import { loadDocument, queryAll, queryOne, getAttribute, getTextContent, elementHasClass } from "../../common/dom";
import type { Element } from "../../common/dom";
import { CubicsPtNewsSchema, type CubicsPtNewsEntryDTO, type CubicsPtNewsDTO } from "../types/albo";
import type { ZodSafeParseResult } from "zod";
import { normalizeWhitespace, extractFirstQuotedValue } from "../../common/utils";

const parseNewsEntry = (row: Element): CubicsPtNewsEntryDTO | null => {
    const categoryImg = queryOne("th.category img", row);
    const statusImg = queryOne("td.status img", row);
    const headlineAnchor = queryOne("td.headline a", row);

    if (!headlineAnchor) {
        return null;
    }

    const title = normalizeWhitespace(getTextContent(headlineAnchor));
    const onclick = getAttribute(headlineAnchor, "onclick") ?? "";
    const href = getAttribute(headlineAnchor, "href");
    const link = extractFirstQuotedValue(onclick) ?? href ?? null;

    return {
        category: getAttribute(categoryImg, "alt"),
        status: getAttribute(statusImg, "alt") ?? getAttribute(statusImg, "src"),
        title,
        link,
    };
};

export const parseCubicsPtNews = (html: string): ZodSafeParseResult<CubicsPtNewsDTO> => {
    const document = loadDocument(html);

    const tabs = queryAll("#tab_element li", document).map((tab) => {
        const anchor = queryOne("a", tab);
        const href = getAttribute(anchor, "href") ?? "";
        const targetId = href.replace(/^#/, "");
        const title = normalizeWhitespace(anchor ? getTextContent(anchor) : "");

        const rows = queryAll(`#${targetId} table.tab-newslist tr`, document)
            .map((row) => parseNewsEntry(row))
            .filter((entry): entry is CubicsPtNewsEntryDTO => entry !== null);

        return {
            id: targetId,
            title,
            entries: rows,
            active: elementHasClass(tab, "selected"),
        };
    });

    const selectedTab = tabs.find((tab) => tab.active);

    return CubicsPtNewsSchema.safeParse({
        selectedTabId: selectedTab ? selectedTab.id : null,
        tabs: tabs.map((tab) => ({
            id: tab.id,
            title: tab.title,
            entries: tab.entries,
        })),
    });
};
