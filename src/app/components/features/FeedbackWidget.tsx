"use client";
import { useState, useEffect, useRef } from "react";
import { sendFeedback } from "@/app/utils/api";
import { toast } from "react-hot-toast";
import { MessageCircle } from "lucide-react";

export default function FeedbackWidget() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    try {
      await sendFeedback(message);
      toast.success("Thank you for your feedback!");
      setMessage("");
      setShowForm(false);
    } catch (err) {
      console.error("Feedback error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowForm(false);
      }
    };
    if (showForm) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showForm]);

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 left-6 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg border border-gray-600 flex items-center gap-2 z-50 transition"
      >
        <MessageCircle className="w-4 h-4" />
        Feedback
      </button>

      {/* Feedback Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-[#181F28] text-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-700"
          >
            <h2 className="text-xl font-bold mb-4">We value your feedback</h2>

            <textarea
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              placeholder="Your feedback..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Email no longer needed; server derives from session */}

            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-sm text-white rounded-md transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
