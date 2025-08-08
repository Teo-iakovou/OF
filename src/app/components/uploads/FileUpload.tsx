"use client";

import { useState, useRef, useEffect } from "react";
import { analyzeImage } from "@/app/utils/api";
import { ClipLoader } from "react-spinners";
import Image from "next/image";

// ✅ Single source of truth for insights
export type Insight = {
  platform: string;
  bestPostTime: string;
  aiCaption?: string;
  tip?: string;
  hashtags?: string[];
  objects?: string[];
  emotion?: string;
  dominantColors?: string[];
};

interface FileUploadProps {
  // ✅ onUploadSuccess now expects a typed Insight
  onUploadSuccess: (insights: Insight) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [justDropped, setJustDropped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke blob URL on unmount or when file changes (avoid leaks)
  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setSelectedFile(file);
    setPreviewURL((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setJustDropped(true);

    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setPreviewURL((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(file);
      });
    }
    setTimeout(() => setJustDropped(false), 300);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const triggerFileInput = () => fileInputRef.current?.click();

  const TEST_EMAIL =
    (typeof window !== "undefined" && localStorage.getItem("userEmail")) ||
    "thedoros09@gmail.com";

  const resetAfterSuccess = () => {
    setSelectedFile(null);
    setPreviewURL((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      // Assume your API returns: { insights: Insight, ... }
      const response = (await analyzeImage(
        selectedFile,
        TEST_EMAIL
      )) as { insights: Insight };

      onUploadSuccess(response.insights);
      resetAfterSuccess();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={(e) => {
          if (isDragging || justDropped) {
            e.preventDefault();
            return;
          }
          triggerFileInput();
        }}
        className={`w-full border-2 ${
          isDragging ? "border-purple-500" : "border-dashed border-gray-600"
        } rounded-lg p-10 text-center cursor-pointer bg-gray-900 transition hover:border-pink-500`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          hidden
        />
        <p className="text-gray-400">
          {isDragging
            ? "Drop the file here..."
            : "Click or drag & drop your image here"}
        </p>
      </div>

      {/* Preview */}
      {previewURL && (
        <div className="text-center">
          <p className="text-sm text-gray-400">Preview:</p>
          <Image
            src={previewURL}
            alt="Preview"
            width={400}
            height={300}
            className="mt-2 w-48 h-48 object-cover rounded-lg shadow-lg border border-gray-700"
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || loading}
        className={`mt-4 py-2 px-6 rounded-lg font-semibold text-white shadow-md transition-all ${
          selectedFile
            ? "bg-pink-600 hover:bg-pink-700 active:scale-95"
            : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze with AI"}
      </button>

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-4">
          <ClipLoader size={40} color="#FF4D88" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;