# Project Overview
- Purpose: TypeScript parsers that transform Chukyo University web portal HTML/JSON (Cubics and Manabo systems) into validated DTOs.
- Tech stack: Bun runtime for tooling and tests, TypeScript with strict compiler options, Cheerio for DOM parsing, Zod schemas for runtime validation.
- Structure: `src/parsers` hosts HTML/JSON parsing logic grouped by portal domain; `src/schemas` defines Zod DTO schemas; `src/index.ts` re-exports public API; `scripts/generate-expected.ts` regenerates JSON fixtures; `test` contains Bun tests with HTML fixtures and expected outputs.
- Distribution: Library-style module (no CLI) exporting parsing helpers via `src/index.ts`.