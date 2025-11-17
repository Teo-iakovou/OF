import { NextRequest, NextResponse } from "next/server";

import { getSadTalkerQueue } from "../_lib/queue";
import type { SadTalkerJobResult, SadTalkerJobError } from "../types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toProgress(progress: unknown): number | undefined {
  if (typeof progress === "number") return Math.max(0, Math.min(100, progress));
  if (progress && typeof progress === "object" && "value" in progress) {
    const value = (progress as { value?: unknown }).value;
    if (typeof value === "number") return Math.max(0, Math.min(100, value));
  }
  return undefined;
}

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams;
    const jobId = search.get("id");
    if (!jobId) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const queue = getSadTalkerQueue();
    const job = await queue.getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const state = await job.getState();
    const progress = toProgress(job.progress);
    const result = job.returnvalue as SadTalkerJobResult | undefined;
    const failedReason = job.failedReason;
    const error = (job as any).stacktrace?.[0] || failedReason;
    const errorPayload = job.data?.error as SadTalkerJobError | undefined;

    return NextResponse.json({
      jobId,
      state,
      progress,
      attempts: job.attemptsMade,
      result,
      error: errorPayload || (error ? { message: String(error) } : undefined),
    });
  } catch (err) {
    console.error("[sadtalker:status] error", err);
    return NextResponse.json({ error: "Failed to fetch job status" }, { status: 500 });
  }
}
