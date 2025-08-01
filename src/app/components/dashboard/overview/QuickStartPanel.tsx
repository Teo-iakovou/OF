"use client";
import Link from "next/link";
import { Upload, MessageSquareText, History } from "lucide-react";

const quickLinks = [
  {
    title: "Upload Content",
    description: "Analyze your image or video for captions, hashtags, and insights.",
    icon: <Upload className="w-6 h-6 text-cyan-400" />,
    href: "/dashboard/upload",
  },
  {
    title: "AI Chat",
    description: "Chat with your AI coach to refine your strategy or captions.",
    icon: <MessageSquareText className="w-6 h-6 text-purple-400" />,
    href: "/dashboard/ai-chat",
  },
  {
    title: "Insight History",
    description: "View your previous uploads and AI-generated recommendations.",
    icon: <History className="w-6 h-6 text-yellow-400" />,
    href: "/dashboard/history",
  },
];

export default function QuickStartPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {quickLinks.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          className="block bg-gray-900 border border-gray-700 hover:border-cyan-600 rounded-xl p-6 shadow transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gray-800 rounded-full p-3">{item.icon}</div>
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
          </div>
          <p className="text-gray-400 text-sm">{item.description}</p>
        </Link>
      ))}
    </div>
  );
}
