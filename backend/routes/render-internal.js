const express = require("express");
const { signUrl, putObject, bucket, endpoint, region } = require("../utils/s3");
const RenderJob = require("../models/renderJob");

const router = express.Router();

function workerAuth(req, res, next) {
  const header = req.headers["authorization"] || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token || token !== process.env.WORKER_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}

// Atomically lease next queued job
router.post("/next-job", workerAuth, async (req, res) => {
  try {
    const job = await RenderJob.findOneAndUpdate(
      { status: "queued" },
      { $set: { status: "running", leasedAt: new Date(), startedAt: new Date() } },
      { sort: { createdAt: 1 }, new: true }
    );
    if (!job) return res.json({ job: null });

    // For convenience, include signed image URL (optional for worker)
    let imageUrl = null;
    let audioUrl = null;
    try {
      imageUrl = await signUrl(job.input.imageKey, 3600);
    } catch {}
    try {
      if (job.input.audioKey) {
        audioUrl = await signUrl(job.input.audioKey, 3600);
      }
    } catch {}

    return res.json({
      job: {
        id: String(job._id),
        kind: job.kind,
        input: job.input,
        costCredits: job.costCredits,
        s3: { bucket, endpoint, region },
        imageUrl,
        audioUrl,
      },
    });
  } catch (e) {
    console.error("/api/render-internal/next-job error", e);
    return res.status(500).json({ error: "Failed to lease job" });
  }
});

// Report job result
router.post("/job-result/:id", workerAuth, async (req, res) => {
  try {
    const { status, output, error, timings } = req.body || {};
    const job = await RenderJob.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (status === "succeeded") {
      job.status = "succeeded";
      job.output = output || job.output;
      job.timings = timings || job.timings;
      job.finishedAt = new Date();
      await job.save();
      return res.json({ ok: true });
    }
    if (status === "failed") {
      job.status = "failed";
      job.error = error || job.error || "failed";
      job.timings = timings || job.timings;
      job.finishedAt = new Date();
      await job.save();
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: "Invalid status" });
  } catch (e) {
    console.error("/api/render-internal/job-result error", e);
    return res.status(500).json({ error: "Failed to update job" });
  }
});

module.exports = router;
