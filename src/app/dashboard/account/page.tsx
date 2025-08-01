"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/"); // Redirect to home
  };

  return (
    <main>
      <header className="pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Account Info
          </h1>
          <div ref={menuRef} className="relative inline-block md:hidden">
            <ProjectNavDropdownButton open={open} setOpen={setOpen} />
            {open && (
              <ProjectNavDropdownMenu
                overlayMode
                onClose={() => setOpen(false)}
              />
            )}
          </div>
        </div>
      </header>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-md space-y-4">
        {email ? (
          <>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <button
              className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </>
        ) : (
          <p className="text-red-400">No account information found.</p>
        )}
      </div>
    </main>
  );
}
