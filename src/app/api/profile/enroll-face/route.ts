import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/proxy";

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: "/api/persona/enroll-face",
    method: "POST",
    includeBody: true,
  });
}
