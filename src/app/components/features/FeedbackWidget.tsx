"use client";
import { useState, useEffect, useRef } from "react";
import { sendFeedback } from "@/app/utils/api";
import { toast } from "react-hot-toast"; // ✅ Fix import
export default function FeedbackWidget() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    try {
      await sendFeedback(message, email);
      toast.success("Thank you for your feedback!");
      setMessage("");
      setEmail("");
      setShowForm(false);
    } catch (err) {
      console.error("Feedback error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // 🔁 Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 left-6 bg-shrine-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-shrine-secondary z-50 transition"
      >
        💬 Feedback
      </button>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white text-black rounded-2xl p-6 w-full max-w-md shadow-xl"
          >
            <h2 className="text-xl font-bold mb-4">We value your feedback</h2>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-shrine-primary"
              placeholder="Your feedback..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your email (optional)"
              className="w-full mt-3 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-shrine-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-full text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-shrine-primary text-white px-4 py-2 rounded-full hover:bg-shrine-secondary transition"
              >
                Send
              </button>
            </div>
            {submitted && (
              <p className="text-green-600 mt-2 text-sm">✅ Feedback sent!</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
