"use client";

import { useEffect, useState, useCallback } from "react";
import { FileText, Trash2, Loader2 } from "lucide-react";
import { DocumentUpload } from "@/components/dashboard/DocumentUpload";

interface RealDocument {
  id: string;
  title: string;
  fileType: string;
  createdAt: string;
  snippet: string;
  charCount: number;
}

export function DocumentsView() {
  const [documents, setDocuments] = useState<RealDocument[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/documents/list");
    const data = await res.json();
    setDocuments(data.documents ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    await load();
    setDeletingId(null);
  };

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-white">Documents</h1>
        <p className="text-sm text-muted">
          Upload documents and Orivexa will use them to answer your questions on the Search page.
        </p>
      </div>

      <div className="mt-6 max-w-xl">
        <DocumentUpload onUploaded={load} />
      </div>

      <div className="mt-8">
        {documents === null && (
          <div className="flex items-center gap-2 text-sm text-muted-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading documents…
          </div>
        )}

        {documents !== null && documents.length === 0 && (
          <p className="text-sm text-muted-2">
            No documents yet. Upload your first one above to start asking questions about it.
          </p>
        )}

        {documents !== null && documents.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-secondary/20 bg-secondary/10 text-secondary-light">
                      <FileText className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <div>
                      <div className="text-sm font-medium text-white">{doc.title}</div>
                      <div className="text-xs text-muted-2">
                        {new Date(doc.createdAt).toLocaleDateString()} · {Math.round(doc.charCount / 1000)}k chars
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="text-muted-2 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                    aria-label={`Delete ${doc.title}`}
                  >
                    {deletingId === doc.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-muted">{doc.snippet}…</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
