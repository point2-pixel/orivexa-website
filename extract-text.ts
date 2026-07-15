const MAX_CHARS = 120_000;

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

  if (
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    type === "application/vnd.ms-excel" ||
    type.endsWith(".xlsx") ||
    type.endsWith(".xls")
  ) {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const parts = workbook.SheetNames.map((name) => {
      const sheet = workbook.Sheets[name];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      return `[Sheet: ${name}]\n${csv}`;
    });
    return truncate(parts.join("\n\n"));
  }

  return truncate(buffer.toString("utf-8"));
}

export const SUPPORTED_EXTENSIONS = [
  ".txt",
  ".md",
  ".csv",
  ".pdf",
  ".docx",
  ".xlsx",
  ".xls",
];
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
