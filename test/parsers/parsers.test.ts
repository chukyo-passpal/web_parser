import { describe, expect, it } from "bun:test";
import { readFileSync } from "fs";
import { parseCubicsAsTimetable } from "../../src/parsers/cubics";
import { parseCubicsPtNews } from "../../src/parsers/albo";
import { parseManaboTimetable } from "../../src/parsers/manaboTimetable";
import { parseManaboNews } from "../../src/parsers/manaboNews";
import { parseManaboReceivedMail, parseManaboSentMail, parseManaboMailView, parseManaboMailSend, parseManaboMailMember } from "../../src/parsers/manaboMail";
import {
    parseManaboClassDirectory,
    parseManaboClassContent,
    parseManaboClassNotAttendContent,
    parseManaboClassEntry,
    parseManaboClassNews,
    parseManaboClassSyllabus,
    parseManaboClassQuizResult,
} from "../../src/parsers/manaboClass";
import { parseManaboEntryForm, parseManaboEntryResponse } from "../../src/parsers/manaboEntry";

const loadFixture = (filename: string): string => readFileSync(new URL(`../fixtures/html/${filename}`, import.meta.url), "utf-8");

const loadExpected = <T>(name: string): T => JSON.parse(readFileSync(new URL(`../expected/${name}.json`, import.meta.url), "utf-8")) as T;

describe("cubics", () => {
    it("parses cubics timetable", () => {
        const result = parseCubicsAsTimetable(loadFixture("cubics-as_timetable.html"));
        expect(result).toEqual(loadExpected("cubics-as_timetable"));
    });

    it("parses cubics portal news", () => {
        const result = parseCubicsPtNews(loadFixture("cubics-pt_news.html"));
        expect(result).toEqual(loadExpected("cubics-pt_news"));
    });
});

describe("manabo timetable", () => {
    it("parses timetable", () => {
        const result = parseManaboTimetable(loadFixture("manabo_timetable.html"));
        expect(result).toEqual(loadExpected("manabo_timetable"));
    });
});

describe("manabo news", () => {
    it("parses system news", () => {
        const result = parseManaboNews(loadFixture("manabo_news.html"));
        expect(result).toEqual(loadExpected("manabo_news"));
    });
});

describe("manabo mail", () => {
    it("parses received mail list", () => {
        const result = parseManaboReceivedMail(loadFixture("manabo_received_mail.html"));
        expect(result).toEqual(loadExpected("manabo_received_mail"));
    });

    it("parses sent mail list", () => {
        const result = parseManaboSentMail(loadFixture("manabo_sent_mail.html"));
        expect(result).toEqual(loadExpected("manabo_sent_mail"));
    });

    it("parses mail view modal", () => {
        const result = parseManaboMailView(loadFixture("manabo_mail_view.html"));
        expect(result).toEqual(loadExpected("manabo_mail_view"));
    });

    it("parses mail send modal", () => {
        const result = parseManaboMailSend(loadFixture("manabo_mail_send.html"));
        expect(result).toEqual(loadExpected("manabo_mail_send"));
    });

    it("parses mail member search", () => {
        const result = parseManaboMailMember(loadFixture("manabo_mail_member.html"));
        expect(result).toEqual(loadExpected("manabo_mail_member"));
    });
});

describe("manabo class", () => {
    it("parses class directory", () => {
        const result = parseManaboClassDirectory(loadFixture("manabo_class_directory.html"));
        expect(result).toEqual(loadExpected("manabo_class_directory"));
    });

    it("parses class content list", () => {
        const result = parseManaboClassContent(loadFixture("manabo_class_content.html"));
        expect(result).toEqual(loadExpected("manabo_class_content"));
    });

    it("parses not attended content stub", () => {
        const result = parseManaboClassNotAttendContent(loadFixture("manabo_class_not_attend_content.html"));
        expect(result).toEqual(loadExpected("manabo_class_not_attend_content"));
    });

    it("parses class entry", () => {
        const result = parseManaboClassEntry(loadFixture("manabo_class_entry.html"));
        expect(result).toEqual(loadExpected("manabo_class_entry"));
    });

    it("parses class news", () => {
        const result = parseManaboClassNews(loadFixture("manabo_class_news.html"));
        expect(result).toEqual(loadExpected("manabo_class_news"));
    });

    it("parses class syllabus", () => {
        const result = parseManaboClassSyllabus(loadFixture("manabo_class_syllabus.html"));
        expect(result).toEqual(loadExpected("manabo_class_syllabus"));
    });

    it("parses class quiz result", () => {
        const result = parseManaboClassQuizResult(loadFixture("manabo_class_quiz_result.html"));
        expect(result).toEqual(loadExpected("manabo_class_quiz_result"));
    });
});

describe("manabo entry", () => {
    it("parses entry form", () => {
        const result = parseManaboEntryForm(loadFixture("manabo_entry_form.html"));
        expect(result).toEqual(loadExpected("manabo_entry_form"));
    });

    it("parses entry response", () => {
        const result = parseManaboEntryResponse(loadFixture("manabo_entry_exist.json"));
        expect(result).toEqual(loadExpected("manabo_entry_exist"));
    });

    it("throws on malformed entry response", () => {
        expect(() => parseManaboEntryResponse('{"success":true}')).toThrow();
    });
});
