import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  return proxyToBackend(request, { path: "/api/billing/addons/verify", method: "GET" });
}
