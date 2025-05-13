const SOLANA_ADDRESS_REGEX: RegExp = /\b[a-zA-Z0-9]{43,44}\b/g;

export function extractSolanaAddresses(text: string): string[] {
    const matches: RegExpMatchArray | null = text.match(SOLANA_ADDRESS_REGEX);
    return matches ?? [];
}