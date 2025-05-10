"use client";
import { Toaster } from "react-hot-toast";

const ToastNotification = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: "#1f2937", // Tailwind gray-800
        color: "#ffffff",
        borderRadius: "1rem",
        fontSize: "0.95rem",
        padding: "1rem 1.25rem",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      },
      success: {
        iconTheme: {
          primary: "#f472b6", // Tailwind pink-400 (Shrine style)
          secondary: "#ffffff",
        },
      },
      error: {
        iconTheme: {
          primary: "#dc2626", // Tailwind red-600
          secondary: "#ffffff",
        },
        style: {
          background: "#7f1d1d", // Tailwind red-900
        },
      },
    }}
  />
);

export default ToastNotification;
