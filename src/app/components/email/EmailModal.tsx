"use client";

import { useState, useEffect, useRef } from "react";

interface EmailModalProps {
  isOpen: boolean;
  onSubmit: (email: string) => void;
  onClose: () => void;
}

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const EmailModal = ({ isOpen, onSubmit, onClose }: EmailModalProps) => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens, reset states
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setTouched(false);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Trap focus inside modal (optional, but good UX)
  useEffect(() => {
    if (!isOpen) return;
    const focusListener = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusable = Array.from(
          document.querySelectorAll<HTMLButtonElement | HTMLInputElement>(
            "input, button"
          )
        ).filter((el) => el.offsetParent !== null);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (
          !document.activeElement ||
          !document.activeElement.contains(document.body)
        ) {
          first.focus();
          e.preventDefault();
        }
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", focusListener);
    return () => document.removeEventListener("keydown", focusListener);
  }, [isOpen]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  }

  function handleSubmit() {
    setTouched(true);
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    onSubmit(email);
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity animate-fadeIn"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Enter your email
        </h2>
        <input
          ref={inputRef}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (touched) {
              setError(
                isValidEmail(e.target.value)
                  ? ""
                  : "Please enter a valid email address."
              );
            }
          }}
          placeholder="Enter your email address"
          className={`w-full text-gray-800 border-2 p-3 rounded-md mb-2 focus:outline-none focus:border-pink-500 ${
            error ? "border-red-400" : "border-gray-300"
          }`}
          onBlur={() => setTouched(true)}
        />
        {error && (
          <div className="text-red-500 mb-4 text-sm text-left">{error}</div>
        )}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleSubmit}
            disabled={!isValidEmail(email)}
            className={`font-bold py-2 px-4 rounded-lg ${
              isValidEmail(email)
                ? "bg-pink-600 hover:bg-pink-700 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            type="button"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s;
        }
      `}</style>
    </div>
  );
};

export default EmailModal;
