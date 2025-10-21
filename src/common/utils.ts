export const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

export const extractFirstQuotedValue = (raw: string | undefined | null): string | null => {
    if (!raw) {
        return null;
    }
    const match = raw.match(/'([^']+)'/);
    return match ? match[1] ?? null : null;
};
