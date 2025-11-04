## Purpose
TypeScript library that parses HTML pages from university systems (ALBO, Cubics, manabo) into validated JSON DTOs using Zod.

## Structure Highlights
- `src/albo`, `src/cubics`, `src/manabo`: parser implementations per system.
- `src/common`: shared DOM helpers built on htmlparser2/css-select.
- `src/index.ts`: re-exports parser entry points.
- `test/`: HTML fixtures and expected JSON for parser verification using Bun test runner.

## Tech Stack
- TypeScript (ESM + CJS builds via tsc).
- Bun as the primary runtime/tooling (`bun test`, `bun run`).
- htmlparser2 + css-select for DOM parsing.
- Zod for schema validation.
- ESLint (js/recommended + typescript-eslint) for linting.
