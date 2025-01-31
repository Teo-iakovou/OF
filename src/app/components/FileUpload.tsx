"use client";

import React, { useState } from "react";

interface FileUploadProps {
  onUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Basic validation: Check file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB. Please select a smaller file.");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError(""); // Clear any previous error
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    } else {
      setError("Please select a file before uploading.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      {selectedFile && (
        <p className="text-gray-700 mb-2">
          Selected File: <strong>{selectedFile.name}</strong>
        </p>
      )}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Upload and Analyze
      </button>
    </div>
  );
};

export default FileUpload;
