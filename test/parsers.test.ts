import { describe, test, expect } from "bun:test";
import { readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ZodSafeParseResult } from "zod";

import {
    parseAlboCalendar,
    parseAlboInformation,
    parseAlboPersonal,
    parseAlboTimetable,
    parseCubicsAsTimetable,
    parseManaboClassDirectory,
    parseManaboClassContent,
    parseManaboClassEntry,
    parseManaboClassNews,
    parseManaboClassSyllabus,
    parseManaboClassQuizResult,
    parseManaboEntryForm,
    parseManaboEntryResponse,
    parseManaboReceivedMail,
    parseManaboSentMail,
    parseManaboMailView,
    parseManaboMailSend,
    parseManaboMailMember,
    parseManaboNews,
    parseManaboTimetable,
} from "../src/index";

type ParserFunction = (input: string) => ZodSafeParseResult<unknown>;

const parserCases: Array<{
    portal: string;
    page: string;
    parser: ParserFunction;
}> = [
    { portal: "albo", page: "calendar", parser: parseAlboCalendar },
    { portal: "albo", page: "information", parser: parseAlboInformation },
    { portal: "albo", page: "personal", parser: parseAlboPersonal },
    { portal: "albo", page: "timetable", parser: parseAlboTimetable },
    { portal: "cubics", page: "timetable", parser: parseCubicsAsTimetable },
    { portal: "manabo", page: "classDirectory", parser: parseManaboClassDirectory },
    { portal: "manabo", page: "classContent", parser: parseManaboClassContent },
    { portal: "manabo", page: "classEntry", parser: parseManaboClassEntry },
    { portal: "manabo", page: "classNews", parser: parseManaboClassNews },
    { portal: "manabo", page: "classSyllabus", parser: parseManaboClassSyllabus },
    { portal: "manabo", page: "classQuizResult", parser: parseManaboClassQuizResult },
    { portal: "manabo", page: "entryForm", parser: parseManaboEntryForm },
    { portal: "manabo", page: "entry", parser: parseManaboEntryResponse },
    { portal: "manabo", page: "mailReceivedList", parser: parseManaboReceivedMail },
    { portal: "manabo", page: "mailSentList", parser: parseManaboSentMail },
    { portal: "manabo", page: "mailView", parser: parseManaboMailView },
    { portal: "manabo", page: "mailSend", parser: parseManaboMailSend },
    { portal: "manabo", page: "mailMember", parser: parseManaboMailMember },
    { portal: "manabo", page: "news", parser: parseManaboNews },
    { portal: "manabo", page: "timetable", parser: parseManaboTimetable },
];

const testRoot = fileURLToPath(new URL(".", import.meta.url));

parserCases.forEach(({ portal, page, parser }) => {
    const fixturesDir = join(testRoot, portal, page, "fixtures");
    const expectedDir = join(testRoot, portal, page, "expected");

    const fixtureFiles = readdirSync(fixturesDir)
        .filter((file) => !file.startsWith("."))
        .sort();

    describe(`[${portal}] ${page}`, () => {
        fixtureFiles.forEach((fixtureFile) => {
            test(fixtureFile, async () => {
                const fixturePath = join(fixturesDir, fixtureFile);
                const expectedFile = `${basename(fixtureFile, extname(fixtureFile))}.json`;
                const expectedPath = join(expectedDir, expectedFile);

                const fixtureContent = await Bun.file(fixturePath).text();
                const expectedContent = await Bun.file(expectedPath).text();
                const expectedData = JSON.parse(expectedContent);

                const result = parser(fixtureContent);

                if (!result.success) {
                    const formattedError =
                        "error" in result && result.error
                            ? result.error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`).join("\n") || result.error.toString()
                            : "Unknown parser error";
                    throw new Error(`Parser failed for ${fixtureFile}: ${formattedError}`);
                }

                expect(result.data).toEqual(expectedData);
            });
        });
    });
});
