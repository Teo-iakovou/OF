"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Spinner from "@/app/components/dashboard/loading spinner/page";

export default function RouteTransitionOverlay() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const start = () => setVisible(true);
    window.addEventListener("route-transition-start", start as any);
    return () => window.removeEventListener("route-transition-start", start as any);
  }, []);

  useEffect(() => {
    // Hide overlay once we land on the target route (dashboard) or any route change completes
    if (visible) setVisible(false);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="scale-110">
        <Spinner />
      </div>
    </div>
  );
}

