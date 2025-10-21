import { parseDocument } from "htmlparser2";
import type { AnyNode, Element, Document } from "domhandler";
import { selectAll, selectOne, is as matchesSelector } from "css-select";
import { getAttributeValue, getInnerHTML, textContent, isTag, getParent, nextElementSibling, prevElementSibling } from "domutils";

type Root = Document | Element | AnyNode[] | null | undefined;

const toArray = (root: Root): AnyNode[] => {
    if (!root) {
        return [];
    }
    if (Array.isArray(root)) {
        return root;
    }
    if ("children" in root && Array.isArray(root.children)) {
        return root.children;
    }
    return [root];
};

export const loadDocument = (html: string): Document => parseDocument(html);

export const queryAll = (selector: string, root: Root): Element[] => selectAll(selector, toArray(root));

export const queryOne = (selector: string, root: Root): Element | null => selectOne(selector, toArray(root));

export const getAttribute = (element: Element | null | undefined, name: string): string | null => {
    if (!element) {
        return null;
    }
    const value = getAttributeValue(element, name);
    return typeof value === "string" ? value : null;
};

export const getTextContent = (node: AnyNode | null | undefined): string => {
    if (!node) {
        return "";
    }
    return textContent(node);
};

const decodeNumericEntities = (value: string): string =>
    value
        .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
            const codePoint = Number.parseInt(hex, 16);
            return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
        })
        .replace(/&#([0-9]+);/g, (match, dec) => {
            const codePoint = Number.parseInt(dec, 10);
            return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
        });

export const getInnerHtml = (element: Element | null | undefined): string => {
    if (!element) {
        return "";
    }
    const inner = getInnerHTML(element);
    const decoded = decodeNumericEntities(inner);
    const normalised = decoded.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const withNbsp = normalised.replace(/\u00a0/g, "&nbsp;");
    return withNbsp.replace(/\salt(?!\s*=)(?=[\s/>])/g, ' alt=""');
};

export const elementHasClass = (element: Element | null | undefined, className: string): boolean => {
    if (!element) {
        return false;
    }
    const classAttr = getAttribute(element, "class");
    if (!classAttr) {
        return false;
    }
    return classAttr.split(/\s+/).includes(className);
};

export const closest = (element: Element | null | undefined, selector: string): Element | null => {
    let current = element;
    while (current) {
        if (matchesSelector(current, selector)) {
            return current;
        }
        const parent = getParent(current);
        current = parent && isTag(parent) ? parent : null;
    }
    return null;
};

export const nextSiblingElement = (element: Element | null | undefined): Element | null => {
    if (!element) {
        return null;
    }
    const sibling = nextElementSibling(element);
    return sibling ?? null;
};

export const previousSiblingElement = (element: Element | null | undefined): Element | null => {
    if (!element) {
        return null;
    }
    const sibling = prevElementSibling(element);
    return sibling ?? null;
};

export const isElement = (node: AnyNode | null | undefined): node is Element => !!node && isTag(node);

export const filterElements = (nodes: AnyNode[]): Element[] => nodes.filter((node): node is Element => isTag(node));

export const getChildrenElements = (element: Element | null | undefined): Element[] => {
    if (!element) {
        return [];
    }
    return filterElements(element.children ?? []);
};

export const matches = (element: Element | null | undefined, selector: string): boolean => {
    if (!element) {
        return false;
    }
    return matchesSelector(element, selector);
};

export { type Element } from "domhandler";
