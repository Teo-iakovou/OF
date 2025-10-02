"use client";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function LoginToastTrigger() {
  useEffect(() => {
    try {
      const flag = sessionStorage.getItem("justLoggedIn");
      if (flag === "1") {
        sessionStorage.removeItem("justLoggedIn");
        toast.success("You are signed in. Welcome back!", { duration: 3000 });
      }
    } catch {}
  }, []);
  return null;
}

