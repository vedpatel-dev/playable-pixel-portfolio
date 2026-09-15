/**
 * Silkscreen renders "&" as an abstract three-bar glyph that reads like
 * mojibake at small sizes. Swap it for "+" wherever content strings are shown
 * in the pixel UI font — the source data in content.ts stays verbatim.
 */
export function pixelSafe(text: string): string {
  return text.replace(/ & /g, " + ");
}
