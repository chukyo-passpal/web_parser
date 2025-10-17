import { load } from "cheerio";
import type { CheerioAPI } from "cheerio";
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
} from "../schemas/manaboMail";

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

const extractPagination = (
    $container: CheerioAPI
): {
    summary: string | null;
    pages: { label: string; page: string; active: boolean }[];
} => {
    const summaryText = normalizeWhitespace($container(".row.margin-top-md .col-sm-2").first().text());
    const pages = $container("ul.pagination li")
        .map((_, element) => {
            const li = $container(element);
            const anchor = li.find("a").first();
            const label = normalizeWhitespace(anchor.text() || anchor.find("span").text());
            return {
                label,
                page: anchor.attr("page") ?? label,
                active: anchor.hasClass("active") || li.hasClass("active"),
            };
        })
        .get()
        .filter((page) => page.label.length > 0);

    return { summary: summaryText.length ? summaryText : null, pages };
};

export const parseManaboReceivedMail = (html: string): ManaboReceivedMailDTO => {
    const $ = load(html);
    const { summary, pages } = extractPagination($);

    const mails = $("table.table-default tbody tr")
        .map((_, row) => {
            const rowElement = $(row);
            const checkbox = rowElement.find('input[type="checkbox"]').first();
            const mailId = checkbox.attr("value") ?? checkbox.attr("name") ?? "";
            const titleAnchor = rowElement.find("td.title a.a-mail-view").first();
            const statusIcon = rowElement.find("td.title img.icon").first();
            const senderThumbnail = rowElement.find("td").eq(2);
            const senderImage = senderThumbnail.find("img").attr("src") ?? null;
            const senderName = normalizeWhitespace(senderThumbnail.text());
            const receivedAt = normalizeWhitespace(rowElement.find("td").eq(3).text());

            const statusAltRaw = normalizeWhitespace(statusIcon.attr("alt") ?? "");

            return {
                id: mailId,
                title: normalizeWhitespace(titleAnchor.text()),
                statusIconAlt: statusAltRaw.length ? statusAltRaw : null,
                statusIconSrc: statusIcon.attr("src") ?? null,
                mailLink: titleAnchor.attr("href") ?? null,
                senderName: senderName.length ? senderName : null,
                senderImage,
                receivedAt,
            };
        })
        .get();

    return ManaboReceivedMailSchema.parse({
        summary,
        pages,
        mails,
    });
};

export const parseManaboSentMail = (html: string): ManaboSentMailDTO => {
    const $ = load(html);
    const summary = normalizeWhitespace($(".row.margin-top-md .col-sm-2").first().text());

    const mails = $("table.table-default tbody tr")
        .map((_, row) => {
            const rowElement = $(row);
            const checkbox = rowElement.find('input[type="checkbox"]').first();
            const mailId = checkbox.attr("value") ?? checkbox.attr("name") ?? "";
            const titleAnchor = rowElement.find("td").eq(1).find("a.a-mail-view").first();
            const statusIcon = rowElement.find("td").eq(1).find("img.icon").first();
            const recipientCell = rowElement.find("td").eq(2);
            const recipientImage = recipientCell.find("img").attr("src") ?? null;
            const recipientName = normalizeWhitespace(recipientCell.text());
            const sentAt = normalizeWhitespace(rowElement.find("td").eq(3).text());
            const unreadCountRaw = normalizeWhitespace(rowElement.find("td").eq(4).text());
            const unreadCount = Number(unreadCountRaw.replace(/[^\d]/g, "")) || 0;
            const statusAltRaw = normalizeWhitespace(statusIcon.attr("alt") ?? "");

            return {
                id: mailId,
                title: normalizeWhitespace(titleAnchor.text()),
                statusIconAlt: statusAltRaw.length ? statusAltRaw : null,
                statusIconSrc: statusIcon.attr("src") ?? null,
                mailLink: titleAnchor.attr("href") ?? null,
                recipientName: recipientName.length ? recipientName : null,
                recipientImage,
                sentAt,
                unreadCount,
            };
        })
        .get();

    return ManaboSentMailSchema.parse({
        summary: summary.length ? summary : null,
        mails,
    });
};

export const parseManaboMailView = (html: string): ManaboMailViewDTO => {
    const $ = load(html);

    const title = normalizeWhitespace($(".modal-title").first().text());
    const replyButton = $(".a-reply-mail").first();
    const nextButton = $(".a-reopen-mail").first();

    const senderBlock = $(".modal-body .margin-top-lg").first();
    const senderImage = senderBlock.find("img").attr("src") ?? null;
    const senderName = normalizeWhitespace(senderBlock.find("b").first().text());
    const sentAtText = normalizeWhitespace(senderBlock.clone().find("a").remove().end().find("script").remove().end().text().replace(senderName, ""));

    const bodyBlock = $(".modal-body .margin-top-lg").eq(1);
    const bodyHtml = bodyBlock.html()?.trim() ?? "";

    return ManaboMailViewSchema.parse({
        title,
        replyMailId: replyButton.attr("reply_mail_id") ?? null,
        fromMemberId: replyButton.attr("from_member_id") ?? null,
        nextMailId: nextButton.attr("mail_id") ?? null,
        senderName,
        senderImage,
        sentAt: sentAtText,
        bodyHtml,
    });
};

export const parseManaboMailSend = (html: string): ManaboMailSendDTO => {
    const $ = load(html);
    const modalTitle = normalizeWhitespace($(".modal-title").first().text());
    const form = $("#form-mail");

    return ManaboMailSendSchema.parse({
        modalTitle,
        form: {
            action: form.find('input[name="action"]').attr("value") ?? "",
            replyMailId: form.find('input[name="reply_mail_id"]').attr("value") ?? null,
            signature: form.find('input[name="signature"]').attr("value") ?? null,
            csrfToken: form.find('input[name="csrf_token"]').attr("value") ?? "",
        },
        submitLabel: normalizeWhitespace($(".button-send-mail").first().text()),
    });
};

export const parseManaboMailMember = (html: string): ManaboMailMemberDTO => {
    const $ = load(html);
    const members = $(".div-mail-members li")
        .map((_, item) => {
            const element = $(item);
            const anchor = element.find("a.a-set-mail-member").first();
            const name = normalizeWhitespace(anchor.text());
            const image = element.find("img").attr("src") ?? null;
            return {
                memberId: anchor.attr("member_id") ?? "",
                name,
                image,
            };
        })
        .get()
        .filter((member) => member.memberId.length > 0);

    return ManaboMailMemberSchema.parse({
        members,
    });
};
