"use client";

import { useState } from "react";

interface EmailModalProps {
  isOpen: boolean;
  onSubmit: (email: string) => void;
  onClose: () => void;
}

const EmailModal = ({ isOpen, onSubmit, onClose }: EmailModalProps) => {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Enter your email
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full text-gray-800 border-2 border-gray-300 p-3 rounded-md mb-6 focus:outline-none focus:border-pink-500"
        />
        <div className="flex justify-between">
          <button
            onClick={() => onSubmit(email)}
            disabled={!email}
            className={`font-bold py-2 px-4 rounded-lg ${
              email
                ? "bg-pink-600 hover:bg-pink-700 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Submit
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
