// Server-only. Extracts plain text from an uploaded file buffer so it can be
// stored and later sent to Claude for question answering.

const MAX_CHARS = 120_000; // ~30k tokens — keeps a single document well within budget

export interface ExtractedDocument {
  text: string;
  truncated: boolean;
}

function truncate(text: string): ExtractedDocument {
  const trimmed = text.trim();
  if (trimmed.length <= MAX_CHARS) {
    return { text: trimmed, truncated: false };
  }
  return { text: trimmed.slice(0, MAX_CHARS), truncated: true };
}

export async function extractText(
  buffer: Buffer,
  fileType: string
): Promise<ExtractedDocument> {
  const type = fileType.toLowerCase();

  if (type === "application/pdf" || type.endsWith(".pdf")) {
    // Lazy import — pdf-parse touches the filesystem at module load in some
    // environments, so we only load it when actually parsing a PDF.
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return truncate(data.text);
  }

  if (
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    type.endsWith(".docx")
  ) {
    const mammoth = await import("mammoth");
    const { value } = await mammoth.extractRawText({ buffer });
    return truncate(value);
  }

  // Plain text, markdown, csv, and anything else we don't have a special
  // parser for yet — treat as UTF-8 text.
  return truncate(buffer.toString("utf-8"));
}

export const SUPPORTED_EXTENSIONS = [".txt", ".md", ".csv", ".pdf", ".docx"];
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB
