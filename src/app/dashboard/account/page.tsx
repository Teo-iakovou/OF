"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  // Mobile Project Nav
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEmail(localStorage.getItem("userEmail"));
  }, []);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  return (
    // Fill dashboard layout; header fixed height, content scrolls
    <div className="h-full flex flex-col overflow-hidden text-white">
      {/* Header */}
      <header className="shrink-0 pt-12 md:pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Account Info</h1>

        {/* Mobile Project Nav under the title */}
        <div className="mt-3 md:hidden" ref={menuRef}>
          <ProjectNavDropdownButton open={open} setOpen={setOpen} />
          {open && (
            <div className="relative z-40">
              <ProjectNavDropdownMenu overlayMode onClose={() => setOpen(false)} />
            </div>
          )}
        </div>
      </header>

      {/* Centered content */}
      <main className="flex-1 min-h-0 overflow-y-auto px-6 md:px-12 lg:px-20 grid place-items-center">
        <div className="w-full max-w-xl">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-md space-y-4">
            {email ? (
              <>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <button
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </>
            ) : (
              <p className="text-red-400">No account information found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}