import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/proxy";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  return proxyToBackend(req, {
    path: "/api/user/check-package",
    method: "GET",
  });
}
