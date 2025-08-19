"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { analyzeImageMultipart } from "@/app/utils/api";
import { getClientEmail } from "@/app/utils/api";
import type { ResultDoc } from "@/app/types/analysis";

interface FileUploadProps {
  onUploadSuccess: (result: ResultDoc, info?: { duplicate?: boolean }) => void;
}

function toErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try { return JSON.stringify(e); } catch { return "Upload failed"; }
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [justDropped, setJustDropped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [withCaptions, setWithCaptions] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (previewURL) URL.revokeObjectURL(previewURL); }, [previewURL]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setSelectedFile(file);
    setPreviewURL(old => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(file); });
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setJustDropped(true);
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setPreviewURL(old => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(file); });
      setError(null);
    }
    setTimeout(() => setJustDropped(false), 300);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const triggerFileInput = () => fileInputRef.current?.click();

  const resetAfterSuccess = () => {
    setSelectedFile(null);
    setPreviewURL(old => { if (old) URL.revokeObjectURL(old); return null; });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploadPct(0);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const email = getClientEmail();
    if (!email) { setError("Please sign in first — no email found."); return; }

    setIsUploading(true);
    setError(null);
    setUploadPct(0);

    try {
      const { insights, duplicate } = await analyzeImageMultipart({
        file: selectedFile,
        email,
        captions: withCaptions,
        onProgress: (pct) => setUploadPct(pct),
      });

      onUploadSuccess(insights as ResultDoc, { duplicate });
      resetAfterSuccess();
    } catch (err: unknown) {
      console.error("Upload failed:", err);
      setError(toErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Upload an image</h3>
        <label className="flex items-center gap-2 text-sm text-gray-200">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={withCaptions}
            onChange={(e) => setWithCaptions(e.target.checked)}
          />
          Generate captions (slower)
        </label>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={(e) => {
          if (isDragging || justDropped) { e.preventDefault(); return; }
          triggerFileInput();
        }}
        className={`w-full border-2 rounded-xl p-8 text-center cursor-pointer transition
          ${isDragging ? "border-purple-500 bg-gray-900" : "border-dashed border-gray-600 bg-gray-900/60 hover:border-pink-500"}`}
      >
        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} hidden />
        <p className="text-gray-300">
          {isDragging ? "Drop the file here..." : "Click or drag & drop your image here"}
        </p>
      </div>

      {/* Preview */}
      {previewURL && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">Preview</p>
          <Image
            src={previewURL}
            alt="Preview"
            width={400}
            height={300}
            className="mt-2 w-48 h-48 object-cover rounded-lg shadow border border-gray-700 mx-auto"
          />
        </div>
      )}

      {/* Error */}
      {error && <div className="mt-3 text-red-400 text-sm">{error}</div>}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || isUploading}
          className={`py-2 px-6 rounded-lg font-semibold text-white shadow-md transition-all
            ${selectedFile ? "bg-pink-600 hover:bg-pink-700 active:scale-95" : "bg-gray-500 cursor-not-allowed"}`}
        >
          {isUploading ? "Uploading…" : "Analyze with AI"}
        </button>

        {isUploading && (
          <div className="flex items-center gap-2">
            <ClipLoader size={20} color="#FF4D88" />
            <div className="text-sm text-gray-300">{uploadPct}%</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;