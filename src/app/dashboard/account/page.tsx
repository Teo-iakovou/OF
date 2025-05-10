"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/"); // Redirect to home
  };

  return (
    <div className="pt-24 px-4 sm:px-6 md:px-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
        Account Info
      </h1>

      <div className="bg-gray-800 rounded-xl p-6 shadow-button space-y-4 text-white">
        {email ? (
          <>
            <p>
              <strong>Email:</strong> {email}
            </p>

            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <p className="text-red-400">No account information found.</p>
        )}
      </div>
    </div>
  );
}
