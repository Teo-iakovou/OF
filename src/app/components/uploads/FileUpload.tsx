"use client";

import { useState, useRef } from "react";
import { analyzeImage } from "@/app/utils/api";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
interface FileUploadProps {
  onUploadSuccess: (insights: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [justDropped, setJustDropped] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setJustDropped(true); // ✅ Mark that a drop just happened
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }

    // Reset the drop state after a short delay so future clicks work
    setTimeout(() => setJustDropped(false), 300);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const TEST_EMAIL =
    localStorage.getItem("userEmail") || "thedoros09@gmail.com";

  // inside handleSubmit
  const handleSubmit = async () => {
    if (!selectedFile) return;

    setLoading(true);

    try {
      const response = await analyzeImage(selectedFile, TEST_EMAIL);
      onUploadSuccess(response.insights);
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
