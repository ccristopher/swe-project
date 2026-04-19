/** Keeps quotes short so the UI / DB stay reasonable. */
export function clampQuote(text: string, maxLen = 300): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return trimmed.slice(0, maxLen);
}
