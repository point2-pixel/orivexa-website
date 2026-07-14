export interface TextChunk {
  index: number;
  content: string;
}

/**
 * Splits text into overlapping chunks by character count.
 * ~1000 chars ≈ 200-250 tokens: small enough for precise retrieval,
 * large enough to stay coherent. 150-char overlap avoids losing
 * meaning when a sentence gets cut at a chunk boundary.
 */
export function chunkText(
  text: string,
  chunkSize = 1000,
  overlap = 150
): TextChunk[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const chunks: TextChunk[] = [];
  let start = 0;
  let index = 0;

  while (start < clean.length) {
    let end = Math.min(start + chunkSize, clean.length);

    if (end < clean.length) {
      const slice = clean.slice(start, end);
      const lastBreak = Math.max(
        slice.lastIndexOf("\n\n"),
        slice.lastIndexOf(". "),
        slice.lastIndexOf("! "),
        slice.lastIndexOf("? ")
      );
      if (lastBreak > chunkSize * 0.5) {
        end = start + lastBreak + 1;
      }
    }

    const content = clean.slice(start, end).trim();
    if (content) {
      chunks.push({ index, content });
      index++;
    }

    if (end >= clean.length) break;
    start = end - overlap;
  }

  return chunks;
}
