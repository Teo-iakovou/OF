#!/usr/bin/env node
// Simple worker stub: leases jobs and uploads a sample MP4 to S3, then reports success.

const axios = require("axios");
const { putObject } = require("../utils/s3");

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";
const WORKER_TOKEN = process.env.WORKER_TOKEN || "";

if (!WORKER_TOKEN) {
  console.error("WORKER_TOKEN not set");
  process.exit(1);
}

async function pollOnce() {
  try {
    const lease = await axios.post(
      `${BACKEND_URL}/api/render-internal/next-job`,
      {},
      { headers: { Authorization: `Bearer ${WORKER_TOKEN}` } }
    );
    const job = lease.data?.job;
    if (!job) {
      console.log("[worker-stub] idle");
      return false;
    }
    console.log("[worker-stub] processing", job.id);

    const sampleUrl =
      "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4";
    const resp = await axios.get(sampleUrl, { responseType: "arraybuffer" });
    const buf = Buffer.from(resp.data);
    const outKey = `outputs/${encodeURIComponent(job.input?.imageKey?.split("/")[1] || "user")}/${Date.now()}.mp4`;
    await putObject(outKey, buf, "video/mp4");

    await axios.post(
      `${BACKEND_URL}/api/render-internal/job-result/${job.id}`,
      {
        status: "succeeded",
        output: { videoKey: outKey, durationSec: 10 },
        timings: { tts_ms: 200, sadtalker_ms: 500, upload_ms: 100 },
      },
      { headers: { Authorization: `Bearer ${WORKER_TOKEN}` } }
    );
    console.log("[worker-stub] done", job.id);
    return true;
  } catch (e) {
    console.error("[worker-stub] error", e?.response?.data || e?.message || e);
    return false;
  }
}

(async function main() {
  console.log("[worker-stub] starting...", BACKEND_URL);
  while (true) {
    const worked = await pollOnce();
    await new Promise((r) => setTimeout(r, worked ? 1000 : 4000));
  }
})();

