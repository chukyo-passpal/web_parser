import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { parseCubicsAsTimetable } from "../src/parsers/cubics";
import { parseCubicsPtNews } from "../src/parsers/albo";
import { parseManaboTimetable } from "../src/parsers/manaboTimetable";
import { parseManaboNews } from "../src/parsers/manaboNews";
import { parseManaboMailMember, parseManaboMailSend, parseManaboMailView, parseManaboReceivedMail, parseManaboSentMail } from "../src/parsers/manaboMail";
import {
    parseManaboClassContent,
    parseManaboClassDirectory,
    parseManaboClassEntry,
    parseManaboClassNews,
    parseManaboClassNotAttendContent,
    parseManaboClassQuizResult,
    parseManaboClassSyllabus,
} from "../src/parsers/manaboClass";
import { parseManaboEntryForm, parseManaboEntryResponse } from "../src/parsers/manaboEntry";

const fixtureBase = join(process.cwd(), "test", "fixtures", "html");
const outputDir = join(process.cwd(), "test", "expected");

mkdirSync(outputDir, { recursive: true });

const loadFixture = (filename: string): string => readFileSync(join(fixtureBase, filename), "utf-8");

const writeExpected = (name: string, data: unknown) => {
    writeFileSync(join(outputDir, `${name}.json`), JSON.stringify(data, null, 2));
};

writeExpected("cubics-as_timetable", parseCubicsAsTimetable(loadFixture("cubics-as_timetable.html")));
writeExpected("cubics-pt_news", parseCubicsPtNews(loadFixture("cubics-pt_news.html")));
writeExpected("manabo_timetable", parseManaboTimetable(loadFixture("manabo_timetable.html")));
writeExpected("manabo_news", parseManaboNews(loadFixture("manabo_news.html")));
writeExpected("manabo_received_mail", parseManaboReceivedMail(loadFixture("manabo_received_mail.html")));
writeExpected("manabo_sent_mail", parseManaboSentMail(loadFixture("manabo_sent_mail.html")));
writeExpected("manabo_mail_view", parseManaboMailView(loadFixture("manabo_mail_view.html")));
writeExpected("manabo_mail_send", parseManaboMailSend(loadFixture("manabo_mail_send.html")));
writeExpected("manabo_mail_member", parseManaboMailMember(loadFixture("manabo_mail_member.html")));
writeExpected("manabo_class_directory", parseManaboClassDirectory(loadFixture("manabo_class_directory.html")));
writeExpected("manabo_class_content", parseManaboClassContent(loadFixture("manabo_class_content.html")));
writeExpected("manabo_class_not_attend_content", parseManaboClassNotAttendContent(loadFixture("manabo_class_not_attend_content.html")));
writeExpected("manabo_class_entry", parseManaboClassEntry(loadFixture("manabo_class_entry.html")));
writeExpected("manabo_class_news", parseManaboClassNews(loadFixture("manabo_class_news.html")));
writeExpected("manabo_class_syllabus", parseManaboClassSyllabus(loadFixture("manabo_class_syllabus.html")));
writeExpected("manabo_class_quiz_result", parseManaboClassQuizResult(loadFixture("manabo_class_quiz_result.html")));
writeExpected("manabo_entry_form", parseManaboEntryForm(loadFixture("manabo_entry_form.html")));
writeExpected("manabo_entry_exist", parseManaboEntryResponse(loadFixture("manabo_entry_exist.json")));
writeExpected("manabo_entry_none", parseManaboEntryResponse(loadFixture("manabo_entry_none.json")));
