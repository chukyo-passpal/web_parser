import {
    loadDocument,
    queryAll,
    queryOne,
    getAttribute,
    getTextContent,
    getInnerHtml,
    nextSiblingElement,
    matches,
    isElement,
    closest,
} from "../../common/dom";
import type { AnyNode, DataNode, Element } from "domhandler";

import {
    ManaboClassContentSchema,
    ManaboClassDirectorySchema,
    ManaboClassEntrySchema,
    ManaboClassNewsSchema,
    ManaboClassQuizResultSchema,
    ManaboClassSyllabusSchema,
    type ManaboClassContentDTO,
    type ManaboClassDirectoryDTO,
    type ManaboClassEntryDTO,
    type ManaboClassNewsDTO,
    type ManaboClassQuizResultDTO,
    type ManaboClassSyllabusDTO,
} from "../types/manaboClass";
import type { ZodSafeParseResult } from "zod";

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();
const findNextMatchingSibling = (element: Element | null | undefined, selector: string): Element | null => {
    let next = nextSiblingElement(element);
    while (next) {
        if (matches(next, selector)) {
            return next;
        }
        next = nextSiblingElement(next);
    }
    return null;
};

export const parseManaboClassDirectory = (html: string): ZodSafeParseResult<ManaboClassDirectoryDTO> => {
    const document = loadDocument(html);
    const classNode = queryOne(".class-top-directory .x-content-drop", document);
    const classId = getAttribute(classNode, "class_id") ?? "";
    const className = normalizeWhitespace(getTextContent(queryOne(".class-top-directory .span-class-name", document)));

    const directories = queryAll(".div-panel-directory li[directory_id]", document)
        .map((node) => {
            const directoryId = getAttribute(node, "directory_id") ?? "";
            const title = normalizeWhitespace(getTextContent(queryOne(".x-directory-name", node)));
            return {
                directoryId,
                title,
            };
        })
        .filter((directory) => directory.directoryId.length > 0 && directory.title.length > 0);

    return ManaboClassDirectorySchema.safeParse({
        classId,
        className,
        directories,
    });
};

export const parseManaboClassContent = (html: string): ZodSafeParseResult<ManaboClassContentDTO> => {
    const document = loadDocument(html);

    const extractDurations = (context: Element): Array<{ label: string; value: string }> => {
        const containers = queryAll(".div-small", context);
        const durations: Array<{ label: string; value: string }> = [];

        containers.forEach((container) => {
            const boldElements = queryAll("b", container);
            boldElements.forEach((bold) => {
                const label = normalizeWhitespace(getTextContent(bold));
                const valueFragments: string[] = [];
                let current: AnyNode | null = bold.next;
                while (current) {
                    if (isElement(current) && current.name.toLowerCase() === "b") {
                        break;
                    }
                    if (isElement(current)) {
                        const tagName = current.name.toLowerCase();
                        if (tagName === "br") {
                            valueFragments.push(" ");
                        } else {
                            valueFragments.push(getTextContent(current));
                        }
                    } else {
                        valueFragments.push(getTextContent(current));
                    }
                    current = current.next;
                }
                const value = normalizeWhitespace(valueFragments.join(" "));
                if (label.length > 0 || value.length > 0) {
                    durations.push({
                        label,
                        value,
                    });
                }
            });
        });

        return durations;
    };

    const contents: ManaboClassContentDTO["contents"] = [];
    const rows = queryAll(".table-class-content tbody tr", document);

    rows.forEach((row) => {
        if (matches(row, ".toggle-area")) {
            return;
        }

        const cells = queryAll("td", row);
        if (!cells.length) {
            return;
        }

        const detailCell = cells[1];
        const pluginIconWrapper = queryOne(".plugin-icon-wrapper", row);
        const pluginIconSrc = getAttribute(queryOne(".plugin-icon", row), "src") ?? "";
        const isIconChecked = (pluginIconWrapper?.attribs?.class ?? "")
            .split(/\s+/)
            .filter((value) => value.length > 0)
            .includes("img-checked");

        const icon = {
            pluginIconSrc,
            isIconChecked,
        };

        const isFileRow = !!detailCell?.attribs?.colspan && detailCell.attribs.colspan === "2";

        if (isFileRow) {
            const commentNode = queryOne(".x-drag-title .cf", row);
            const comment = commentNode ? getInnerHtml(commentNode).trim() : "";
            const files = queryAll(".margin-top-md .display-block", row)
                .map((block) => {
                    const link = queryOne("a", block);
                    const fileName = normalizeWhitespace(getTextContent(link));
                    const href = getAttribute(link, "href") ?? "";
                    const fileIcon = getAttribute(queryOne("img.icon", block), "src") ?? "";
                    return {
                        fileName,
                        href,
                        icon: fileIcon,
                    };
                })
                .filter((file) => file.fileName.length > 0 || file.href.length > 0 || file.icon.length > 0);

            contents.push({
                type: "file",
                icon,
                attachedFile: {
                    comment,
                    files,
                    duration: extractDurations(row),
                },
            });
            return;
        }

        const titleAnchor = queryOne("a.a-content-open", row);
        const titleElement = titleAnchor ?? queryOne("b", row);
        const title = titleElement ? normalizeWhitespace(getTextContent(titleElement)) : "";
        const contentId = titleAnchor ? getAttribute(titleAnchor, "content_id") ?? "" : "";
        const pluginKey = titleAnchor ? getAttribute(titleAnchor, "plugin_key") ?? "" : "";
        const duration = extractDurations(row);

        const toggleRow = findNextMatchingSibling(row, ".toggle-area");
        const toggleContainer = toggleRow ? queryOne(".x-content-hide", toggleRow) ?? toggleRow : null;
        const descriptionNode = toggleContainer ? queryOne(".description", toggleContainer) : null;
        const description = descriptionNode ? getInnerHtml(descriptionNode).trim() : "";
        const isExpired = toggleContainer ? !!queryOne(".confirm .error", toggleContainer) : false;
        const actions = toggleContainer
            ? queryAll(".confirm a.btn", toggleContainer).map((actionNode) => ({
                  title: normalizeWhitespace(getTextContent(actionNode)),
                  href: getAttribute(actionNode, "href") ?? "",
              }))
            : [];

        contents.push({
            type: "report",
            icon,
            content: {
                title,
                contentId,
                pluginKey,
                duration,
            },
            toggleArea: {
                description,
                isExpired,
                actions,
            },
        });
    });

    return ManaboClassContentSchema.safeParse({
        contents,
    });
};

export const parseManaboClassEntry = (html: string): ZodSafeParseResult<ManaboClassEntryDTO> => {
    const document = loadDocument(html);
    const rows = queryAll("table.table-default tbody tr", document)
        .filter((row) => {
            const cells = queryAll("td", row);
            // colspan属性を持つセルがある場合（空の状態を示す行）をフィルタリング
            const hasColspan = cells.some((cell) => getAttribute(cell, "colspan") !== null);
            return !hasColspan;
        })
        .map((row) => {
            const cells = queryAll("td", row);
            const directory = normalizeWhitespace(getTextContent(cells[0] ?? null));
            const lectureDateRaw = normalizeWhitespace(getTextContent(cells[1] ?? null));
            const status = normalizeWhitespace(getTextContent(cells[2] ?? null));
            return {
                directory,
                lectureDate: lectureDateRaw.length ? lectureDateRaw : null,
                status,
            };
        });

    return ManaboClassEntrySchema.safeParse({
        rows,
    });
};

export const parseManaboClassNews = (html: string): ZodSafeParseResult<ManaboClassNewsDTO> => {
    const document = loadDocument(html);
    const items = queryAll("dl.x-openclose", document).map((dl) => {
        const title = normalizeWhitespace(getTextContent(queryOne("dt b", dl)));
        const bodyHtml = getInnerHtml(queryOne("dd", dl)).trim() || "";
        return {
            id: getAttribute(dl, "id"),
            title,
            bodyHtml,
        };
    });

    return ManaboClassNewsSchema.safeParse({
        items,
    });
};

export const parseManaboClassSyllabus = (html: string): ZodSafeParseResult<ManaboClassSyllabusDTO> => {
    const document = loadDocument(html);

    const mainTable = queryOne(".panel-body .table.table-default", document);
    const rows = mainTable ? queryAll("tr", mainTable).filter((row) => closest(row, "table") === mainTable) : [];

    let object = "";
    let goal: string[] = [];
    let method = "";
    let usedMethods: string[] = [];
    let evaluation: Array<{ type: string; weight: string }> = [];
    const textbooks: Array<{ type: string; title: string }> = [];
    let references: Array<{ title: string; code: string }> = [];
    let officeHour = "";
    let plan: Array<{ no: number; item: string; content: string }> = [];
    let comment = "";
    let prePostStudy = "";

    const isDataNode = (node: unknown): node is DataNode => !!node && typeof (node as DataNode).data === "string";

    const collectSiblingText = (element: Element | null): string => {
        if (!element) {
            return "";
        }

        const fragments: string[] = [];
        let current: AnyNode | null = element.next;

        while (current) {
            if (isElement(current)) {
                if (current.name.toLowerCase() === "br") {
                    break;
                }
                fragments.push(getTextContent(current));
            } else if (isDataNode(current)) {
                fragments.push(current.data);
            }

            current = current.next;
        }

        return normalizeWhitespace(fragments.join(" "));
    };

    rows.forEach((row) => {
        const heading = normalizeWhitespace(getTextContent(queryOne("th", row)));
        const cell = queryOne("td", row);

        switch (heading) {
            case "授業概要・目的": {
                object = normalizeWhitespace(getTextContent(cell));
                break;
            }
            case "学修到達目標": {
                goal = queryAll("li", cell)
                    .map((item) => normalizeWhitespace(getTextContent(item)))
                    .filter((item) => item.length > 0);
                break;
            }
            case "授業方法": {
                method = normalizeWhitespace(getTextContent(cell));
                break;
            }
            case "活用される授業方法": {
                usedMethods = queryAll("input.usemethod[checked]", cell)
                    .map((input) => collectSiblingText(input))
                    .filter((value) => value.length > 0);
                break;
            }
            case "成績評価方法・基準": {
                evaluation = queryAll("table tr", cell)
                    .map((evalRow) => {
                        const columns = queryAll("td", evalRow);
                        const type = normalizeWhitespace(getTextContent(columns[0] ?? null));
                        const weight = normalizeWhitespace(getTextContent(columns[1] ?? null));
                        if (!type || !weight) {
                            return null;
                        }
                        return { type, weight };
                    })
                    .filter((item): item is { type: string; weight: string } => item !== null);
                break;
            }
            case "教科書・教材・参考文献": {
                queryAll("table tr", cell).forEach((bookRow) => {
                    const cells = queryAll("td", bookRow);
                    const label = normalizeWhitespace(getTextContent(cells[0] ?? null));
                    const valueCell = cells[1] ?? null;

                    if (!valueCell) {
                        return;
                    }

                    if (label.includes("教科書・教材")) {
                        const title = normalizeWhitespace(getTextContent(valueCell));
                        if (title) {
                            textbooks.push({
                                type: label,
                                title,
                            });
                        }
                    } else if (label.includes("参考文献")) {
                        references = queryAll("li", valueCell)
                            .map((item) => {
                                const title = normalizeWhitespace(getTextContent(item));
                                const code = getAttribute(item, "data-code") ?? "";
                                if (!title || !code) {
                                    return null;
                                }
                                return {
                                    title,
                                    code,
                                };
                            })
                            .filter((item): item is { title: string; code: string } => item !== null);
                    }
                });
                break;
            }
            case "質問への対応（オフィスアワー等）": {
                officeHour = normalizeWhitespace(getTextContent(cell));
                break;
            }
            case "授業計画": {
                const planTable = queryOne("table", cell);
                plan = queryAll("tbody tr", planTable)
                    .map((planRow) => {
                        const cols = queryAll("td", planRow);
                        const noText = normalizeWhitespace(getTextContent(cols[0] ?? null));
                        const item = normalizeWhitespace(getTextContent(cols[1] ?? null));
                        const content = normalizeWhitespace(getTextContent(cols[2] ?? null));
                        const no = Number.parseInt(noText, 10);
                        if (!Number.isFinite(no) || !item || !content) {
                            return null;
                        }
                        return { no, item, content };
                    })
                    .filter((entry): entry is { no: number; item: string; content: string } => entry !== null);
                break;
            }
            case "履修者へのコメント": {
                comment = normalizeWhitespace(getTextContent(cell));
                break;
            }
            case "事前事後学習": {
                prePostStudy = normalizeWhitespace(getTextContent(cell)).replace(/\s+\(/g, "(");
                break;
            }
            default:
                break;
        }
    });

    return ManaboClassSyllabusSchema.safeParse({
        object,
        goal,
        method,
        usedMethods,
        evaluation,
        textbooks,
        references,
        officeHour,
        plan,
        comment,
        prePostStudy,
    });
};

export const parseManaboClassQuizResult = (html: string): ZodSafeParseResult<ManaboClassQuizResultDTO> => {
    const document = loadDocument(html);
    const scoreText = normalizeWhitespace(getTextContent(queryOne(".text-center .Red b", document)));
    const totalTextRaw = normalizeWhitespace(getTextContent(queryOne(".text-center", document)));
    const totalText = totalTextRaw.split("/")[1] ?? "0";
    const obtained = Number(scoreText.replace(/[^\d]/g, "")) || 0;
    const total = Number(totalText.replace(/[^\d]/g, "")) || 0;
    const totalItemsText = normalizeWhitespace(getTextContent(queryOne(".row.margin-top-md .col-sm-2", document)));

    let currentPage = "";

    const questions = queryAll("table.table-default-grade tbody tr", document).map((row) => {
        const cells = queryAll("td", row);
        let cellIndex = 0;

        const firstCell = cells[cellIndex];
        if (getAttribute(firstCell, "rowspan")) {
            currentPage = normalizeWhitespace(getTextContent(firstCell));
            cellIndex += 1;
        } else if (cells.length === 7) {
            currentPage = normalizeWhitespace(getTextContent(firstCell));
            cellIndex += 1;
        }

        const questionNumber = normalizeWhitespace(getTextContent(cells[cellIndex] ?? null));
        cellIndex += 1;

        const questionCell = cells[cellIndex] ?? null;
        const instruction = queryOne(".div-instructions", questionCell ?? null);
        const questionText = normalizeWhitespace(instruction ? getTextContent(instruction) : getTextContent(questionCell));
        cellIndex += 1;

        const correctAnswer = normalizeWhitespace(getTextContent(cells[cellIndex] ?? null));
        cellIndex += 1;

        const studentAnswer = normalizeWhitespace(getTextContent(cells[cellIndex] ?? null));
        cellIndex += 1;

        const resultCell = cells[cellIndex] ?? null;
        const resultIcon = queryOne("img", resultCell ?? null);
        const resultText = normalizeWhitespace(getTextContent(resultCell));
        cellIndex += 1;

        const teacherComment = normalizeWhitespace(getTextContent(cells[cellIndex] ?? null));
        const resultAltRaw = normalizeWhitespace(getAttribute(resultIcon, "alt") ?? "");

        return {
            page: currentPage,
            questionNumber,
            questionText,
            correctAnswer,
            studentAnswer,
            resultIconAlt: resultAltRaw.length ? resultAltRaw : null,
            resultIconSrc: getAttribute(resultIcon, "src"),
            resultText: resultText.length ? resultText : null,
            teacherComment: teacherComment.length ? teacherComment : null,
        };
    });

    return ManaboClassQuizResultSchema.safeParse({
        score: {
            obtained,
            total,
        },
        totalItemsText: totalItemsText.length ? totalItemsText : null,
        questions,
    });
};
