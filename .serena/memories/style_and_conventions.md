## Coding Style
- Strict TypeScript with modular functions; DTOs validated via Zod schemas (`ManaboClass*Schema`, etc.).
- Utility helpers (e.g., `normalizeWhitespace`, DOM traversal helpers) live in `src/common` and are reused across parsers.
- Prefer pure functions returning `ZodSafeParseResult` objects; avoid side effects.
- Use concise comments only where logic is non-obvious; existing code is mostly self-documenting.

## Linting Rules
- ESLint `js/recommended` plus `typescript-eslint` defaults.
- Browser globals enabled via `globals.browser` configuration.

## Naming
- DTO interfaces follow `*DTO` suffix; parser exports use `parse<Context>` naming.
- Helper functions use descriptive verb phrases (`findNextMatchingSibling`, `extractDurations`).
