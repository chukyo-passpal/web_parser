# Project Summary

**Name:** `@chukyo-passpal/web_parser`
**Description:** A TypeScript library for parsing HTML content from university systems (Albo, Cubics, Manabo). It extracts data into structured, validated objects.

## Structure
- `src/`: Source code
  - `common/`: Shared DOM utilities (`dom.ts`) and helpers.
  - `albo/`, `cubics/`, `manabo/`: Modules for specific systems.
    - `parser/`: Parsing logic functions.
    - `types/`: Zod schemas and TypeScript type definitions.
  - `index.ts`: Main entry point exporting all parsers and types.
- `test/`: Tests
  - `parsers.test.ts`: Main test file running data-driven tests.
  - `fixtures/`: HTML files for testing.
  - `expected/`: JSON files with expected parse results.
