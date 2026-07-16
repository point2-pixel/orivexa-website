"use client";

import { useRef, useState, type DragEvent } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  onUploaded: () => void;
}

export function DocumentUpload({ onUploaded }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      onUploaded();
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  return (
    <div>
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging
            ? "border-accent/50 bg-accent/[0.04]"
            : "border-white/[0.12] bg-white/[0.015] hover:border-white/25"
        )}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        ) : (
          <UploadCloud className="h-6 w-6 text-muted-2" strokeWidth={1.5} />
        )}
        <div>
          <p className="text-sm text-white">
            {uploading ? "Uploading and reading document…" : "Drop a file here, or click to browse"}
          </p>
          <p className="mt-1 text-xs text-muted-2">.txt, .md, .csv, .pdf, .docx — up to 15 MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.md,.csv,.pdf,.docx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </motion.div>

      {error && (
        <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3.5 py-3 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
