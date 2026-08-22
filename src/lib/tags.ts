export function parseTagNames(text: string): string[] {
  const names = text
    .split(/[,、\s]+/)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  return Array.from(new Set(names));
}
