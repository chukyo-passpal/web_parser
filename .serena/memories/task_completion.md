# Task Completion Checklist
- Run `bun test` to ensure all parsers still match expected fixtures.
- If parser outputs change intentionally, regenerate fixtures via `bun run scripts/generate-expected.ts` and commit updated files.
- Update type exports in `src/index.ts` when adding new DTOs or parsers so the public API stays synced.
- Review README if public usage or command flow changes.