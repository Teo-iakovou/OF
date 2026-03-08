import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return proxyToBackend(request, {
    path: `/api/render/jobs/${encodeURIComponent(id)}`,
    method: "GET",
  });
}
