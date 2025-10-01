#!/usr/bin/env node
// Health check for worker auth + lease/report endpoints.
// Usage: BACKEND_URL=... WORKER_TOKEN=... node health-check.js

const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";
const WORKER_TOKEN = process.env.WORKER_TOKEN || "";

if (!WORKER_TOKEN) {
  console.error("[health] WORKER_TOKEN not set");
  process.exit(1);
}

async function main() {
  try {
    // 1) Check lease endpoint (should return { job: null } when queue empty)
    const lease = await axios.post(
      `${BACKEND_URL}/api/render-internal/next-job`,
      {},
      { headers: { Authorization: `Bearer ${WORKER_TOKEN}` }, timeout: 10000 }
    );
    const job = lease.data && lease.data.job;
    if (job) {
      console.log(`[health] Lease OK, but there is a queued job: ${job.id}`);
    } else {
      console.log("[health] Lease OK, no queued jobs (expected before upload)");
    }

    // 2) Check report endpoint (expect 404 for fake id, which confirms auth + route works)
    const fakeId = "000000000000000000000000"; // 24-char hex
    try {
      await axios.post(
        `${BACKEND_URL}/api/render-internal/job-result/${fakeId}`,
        { status: "failed", error: "health-check" },
        { headers: { Authorization: `Bearer ${WORKER_TOKEN}` }, timeout: 10000 }
      );
      console.log("[health] Report endpoint returned 200 unexpectedly");
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) {
        console.log("[health] Report OK (404 Not Found expected for fake id)");
      } else if (status === 401) {
        console.error("[health] Report Unauthorized (check WORKER_TOKEN)");
        process.exit(2);
      } else {
        console.error(`[health] Report error: ${status || e.message}`);
        process.exit(3);
      }
    }

    console.log("[health] All checks passed");
  } catch (e) {
    console.error("[health] Lease error:", e?.response?.status || e?.message || e);
    process.exit(4);
  }
}

main();

