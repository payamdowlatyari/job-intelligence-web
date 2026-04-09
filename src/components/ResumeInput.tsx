"use client";

import { useRef, useState } from "react";
import { Upload, X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useResume } from "@/lib/resume-context";

/**
 * Extracts the text from a PDF file.
 * @param {File} file - The PDF file to extract the text from.
 * @returns {Promise<string>} - A promise that resolves with the extracted text.
 */
async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map(item => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(text);
  }

  return pages.join("\n\n");
}

interface ResumeInputProps {
  id: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
}

/**
 * A form component that allows users to input their resume text.
 * @param {{ id: string, value: string, onChange: (text: string) => void, error?: string }} props - The properties of the component.
 */
export function ResumeInput({ id, value, onChange, error }: ResumeInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { resumeText, setResumeText, hasSavedResume } = useResume();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const isTxt = file.type === "text/plain" || file.name.endsWith(".txt");

    if (!isPdf && !isTxt) {
      setUploadError("Only .txt and .pdf files are supported.");
      e.target.value = "";
      return;
    }

    if (isPdf) {
      setUploading(true);
      try {
        const text = await extractTextFromPdf(file);
        onChange(text);
      } catch {
        setUploadError("Failed to extract text from PDF.");
      } finally {
        setUploading(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = ev => {
        const text = ev.target?.result;
        if (typeof text === "string") {
          onChange(text);
        }
      };
      reader.readAsText(file);
    }

    // Reset so the same file can be re-uploaded
    e.target.value = "";
  }

  function handleLoadSaved() {
    onChange(resumeText);
  }

  function handleSave() {
    if (value.length >= 50) {
      setResumeText(value);
    }
  }

  function handleClear() {
    onChange("");
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>Resume Text *</Label>
        <div className="flex items-center gap-1.5">
          {hasSavedResume && !value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLoadSaved}
              className="h-7 text-xs gap-1">
              Load saved
            </Button>
          )}
          {value && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-7 text-xs gap-1"
                title="Save resume for later">
                <Save className="h-3 w-3" />
                Save
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 text-xs gap-1">
                <X className="h-3 w-3" />
                Clear
              </Button>
            </>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="h-7 text-xs gap-1">
            {uploading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Upload className="h-3 w-3" />
            )}
            {uploading ? "Reading…" : "Upload"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,text/plain,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
      <Textarea
        id={id}
        placeholder="Paste your full resume text here…"
        className="min-h-[160px]"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
    </div>
  );
}
