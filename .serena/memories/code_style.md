# Code Style and Conventions

## Naming
- **Functions/Variables:** camelCase (e.g., `parseManaboNews`, `normalizeWhitespace`).
- **Types/Schemas:** PascalCase (e.g., `ManaboNewsDTO`, `ManaboNewsSchema`).
- **Files:** camelCase (e.g., `manaboNews.ts`).

## Parsing Pattern
1. **Input:** HTML string.
2. **Output:** `ZodSafeParseResult<DTO>`.
3. **Process:**
   - Load document using `loadDocument(html)` from `common/dom`.
   - Query elements using `queryAll`, `queryOne`.
   - Extract text using `getTextContent` and normalize whitespace.
   - Construct a plain object.
   - Return `Schema.safeParse(object)`.

## Directory Structure
- Keep parsers and types separated in `parser/` and `types/` subdirectories within each system module.
- Export everything from the system's `index.ts`.

## Imports
- Use relative imports for internal modules.
- Import DOM helpers from `../../common/dom`.
