# Style & Conventions
- Language: TypeScript in ESNext module mode with Bun toolchain; strict compiler flags enabled.
- Naming: Public API functions follow `parse<Domain><Entity>` naming; DTO and schema types use `PascalCase` with `DTO` suffix.
- Patterns: Parsers load HTML with Cheerio, normalize whitespace, and build plain objects validated by Zod schemas before returning.
- Code style: Uses arrow functions, early returns, `const` bindings, and explicit `null` where data may be absent; comments are minimal unless logic is non-obvious.
- Formatting: No dedicated formatter configured; follow existing lightweight spacing and indentation (4-space in exports, 4-space indent inside blocks).