import { loadDocument, queryAll, queryOne, getAttribute, getTextContent, getInnerHtml, elementHasClass, isElement } from "../../common/dom";
import type { AnyNode, Document } from "domhandler";
import {
    ManaboMailMemberSchema,
    ManaboMailSendSchema,
    ManaboMailViewSchema,
    ManaboReceivedMailSchema,
    ManaboSentMailSchema,
    type ManaboMailMemberDTO,
    type ManaboMailSendDTO,
    type ManaboMailViewDTO,
    type ManaboReceivedMailDTO,
    type ManaboSentMailDTO,
} from "../types/manaboMail";
import type { ZodSafeParseResult } from "zod";

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

const collectTextExcluding = (nodes: AnyNode[], exclude: (node: AnyNode) => boolean): string =>
    normalizeWhitespace(
        nodes
            .filter((node) => !exclude(node))
            .map((node) => getTextContent(node))
            .join(" ")
    );

const extractPagination = (
    document: Document
): {
    summary: string | null;
    pages: { label: string; page: string; active: boolean }[];
} => {
    const summaryElement = queryOne(".row.margin-top-md .col-sm-2", document);
    const summaryText = normalizeWhitespace(getTextContent(summaryElement));

    const pages = queryAll("ul.pagination li", document)
        .map((li) => {
            const anchor = queryOne("a", li);
            const labelSource = anchor ?? queryOne("span", li);
            const label = normalizeWhitespace(getTextContent(labelSource));
            return {
                label,
                page: anchor ? getAttribute(anchor, "page") ?? label : label,
                active: (anchor ? elementHasClass(anchor, "active") : false) || elementHasClass(li, "active"),
            };
        })
        .filter((page) => page.label.length > 0);

    return {
        summary: summaryText.length ? summaryText : null,
        pages,
    };
};

export const parseManaboReceivedMail = (html: string): ZodSafeParseResult<ManaboReceivedMailDTO> => {
    const document = loadDocument(html);
    const { summary, pages } = extractPagination(document);

    const mails = queryAll("table.table-default tbody tr", document).map((row) => {
        const cells = queryAll("td", row);
        const checkbox = queryOne('input[type="checkbox"]', row);
        const mailId = getAttribute(checkbox, "value") ?? getAttribute(checkbox, "name") ?? "";
        const titleAnchor = queryOne("td.title a.a-mail-view", row);
        const statusIcon = queryOne("td.title img.icon", row);
        const senderCell = cells[2];
        const senderImage = getAttribute(queryOne("img", senderCell ?? null), "src");
        const senderName = normalizeWhitespace(getTextContent(senderCell));
        const receivedAt = normalizeWhitespace(getTextContent(cells[3] ?? null));
        const statusAltRaw = normalizeWhitespace(getAttribute(statusIcon, "alt") ?? "");

        return {
            id: mailId,
            title: normalizeWhitespace(getTextContent(titleAnchor)),
            statusIconAlt: statusAltRaw.length ? statusAltRaw : null,
            statusIconSrc: getAttribute(statusIcon, "src"),
            mailLink: getAttribute(titleAnchor, "href"),
            senderName: senderName.length ? senderName : null,
            senderImage,
            receivedAt,
        };
    });

    return ManaboReceivedMailSchema.safeParse({
        summary,
        pages,
        mails,
    });
};

export const parseManaboSentMail = (html: string): ZodSafeParseResult<ManaboSentMailDTO> => {
    const document = loadDocument(html);
    const summaryRaw = normalizeWhitespace(getTextContent(queryOne(".row.margin-top-md .col-sm-2", document)));

    const mails = queryAll("table.table-default tbody tr", document).map((row) => {
        const cells = queryAll("td", row);
        const checkbox = queryOne('input[type="checkbox"]', row);
        const mailId = getAttribute(checkbox, "value") ?? getAttribute(checkbox, "name") ?? "";
        const titleCell = cells[1];
        const titleAnchor = queryOne("a.a-mail-view", titleCell ?? null);
        const statusIcon = queryOne("img.icon", titleCell ?? null);
        const recipientCell = cells[2];
        const recipientImage = getAttribute(queryOne("img", recipientCell ?? null), "src");
        const recipientName = normalizeWhitespace(getTextContent(recipientCell));
        const sentAt = normalizeWhitespace(getTextContent(cells[3] ?? null));
        const unreadCountRaw = normalizeWhitespace(getTextContent(cells[4] ?? null));
        const unreadCount = Number(unreadCountRaw.replace(/[^\d]/g, "")) || 0;
        const statusAltRaw = normalizeWhitespace(getAttribute(statusIcon, "alt") ?? "");

        return {
            id: mailId,
            title: normalizeWhitespace(getTextContent(titleAnchor)),
            statusIconAlt: statusAltRaw.length ? statusAltRaw : null,
            statusIconSrc: getAttribute(statusIcon, "src"),
            mailLink: getAttribute(titleAnchor, "href"),
            recipientName: recipientName.length ? recipientName : null,
            recipientImage,
            sentAt,
            unreadCount,
        };
    });

    return ManaboSentMailSchema.safeParse({
        summary: summaryRaw.length ? summaryRaw : null,
        mails,
    });
};

export const parseManaboMailView = (html: string): ZodSafeParseResult<ManaboMailViewDTO> => {
    const document = loadDocument(html);

    const title = normalizeWhitespace(getTextContent(queryOne(".modal-title", document)));
    const replyButton = queryOne(".a-reply-mail", document);
    const nextButton = queryOne(".a-reopen-mail", document);

    const senderBlocks = queryAll(".modal-body .margin-top-lg", document);
    const senderBlock = senderBlocks[0];
    const bodyBlock = senderBlocks[1];

    const senderImage = getAttribute(queryOne("img", senderBlock ?? null), "src");
    const senderName = normalizeWhitespace(getTextContent(queryOne("b", senderBlock ?? null)));
    const sentAtRaw = senderBlock
        ? collectTextExcluding(senderBlock.children ?? [], (node) => {
              if (!isElement(node)) {
                  return false;
              }
              const name = node.name.toLowerCase();
              return name === "a" || name === "script";
          })
        : "";
    const sentAt = normalizeWhitespace(sentAtRaw);

    const bodyHtml = bodyBlock ? getInnerHtml(bodyBlock).trim() : "";

    return ManaboMailViewSchema.safeParse({
        title,
        replyMailId: getAttribute(replyButton, "reply_mail_id"),
        fromMemberId: getAttribute(replyButton, "from_member_id"),
        nextMailId: getAttribute(nextButton, "mail_id"),
        senderName,
        senderImage,
        sentAt,
        bodyHtml,
    });
};

export const parseManaboMailSend = (html: string): ZodSafeParseResult<ManaboMailSendDTO> => {
    const document = loadDocument(html);
    const modalTitle = normalizeWhitespace(getTextContent(queryOne(".modal-title", document)));
    const form = queryOne("#form-mail", document);

    return ManaboMailSendSchema.safeParse({
        modalTitle,
        form: {
            action: getAttribute(queryOne('input[name="action"]', form ?? null), "value") ?? "",
            replyMailId: getAttribute(queryOne('input[name="reply_mail_id"]', form ?? null), "value"),
            signature: getAttribute(queryOne('input[name="signature"]', form ?? null), "value"),
            csrfToken: getAttribute(queryOne('input[name="csrf_token"]', form ?? null), "value") ?? "",
        },
        submitLabel: normalizeWhitespace(getTextContent(queryOne(".button-send-mail", document))),
    });
};

export const parseManaboMailMember = (html: string): ZodSafeParseResult<ManaboMailMemberDTO> => {
    const document = loadDocument(html);
    const members = queryAll(".div-mail-members li", document)
        .map((item) => {
            const anchor = queryOne("a.a-set-mail-member", item);
            const name = normalizeWhitespace(getTextContent(anchor));
            const image = getAttribute(queryOne("img", item), "src");
            return {
                memberId: getAttribute(anchor, "member_id") ?? "",
                name,
                image,
            };
        })
        .filter((member) => member.memberId.length > 0);

    return ManaboMailMemberSchema.safeParse({
        members,
    });
};
