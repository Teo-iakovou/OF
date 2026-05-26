const OutputFeedback = require("../models/outputFeedback");
const { sendErr } = require("../utils/sendErr");

const VALID_TYPES = ["upload_report", "video"];
const VALID_VOTES = ["up", "down"];

const submitOutputFeedback = async (req, res) => {
  try {
    if (!req.user?.id) return sendErr(req, res, 401, "Unauthorized");

    const { type, referenceId, vote } = req.body || {};

    if (!VALID_TYPES.includes(type)) {
      return sendErr(req, res, 400, "Invalid type");
    }
    if (typeof referenceId !== "string" || !referenceId.trim()) {
      return sendErr(req, res, 400, "Invalid referenceId");
    }
    if (!VALID_VOTES.includes(vote)) {
      return sendErr(req, res, 400, "Invalid vote");
    }

    const record = await OutputFeedback.findOneAndUpdate(
      { userId: req.user.id, type, referenceId: referenceId.trim() },
      { vote, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ ok: true, vote: record.vote });
  } catch (err) {
    if (err.code === 11000) {
      return sendErr(req, res, 409, "Duplicate vote");
    }
    return sendErr(req, res, 500, "Failed to save feedback");
  }
};

const getOutputFeedback = async (req, res) => {
  try {
    if (!req.user?.id) return sendErr(req, res, 401, "Unauthorized");

    const { type, referenceId } = req.query;

    if (!VALID_TYPES.includes(type)) {
      return sendErr(req, res, 400, "Invalid type");
    }
    if (typeof referenceId !== "string" || !referenceId.trim()) {
      return sendErr(req, res, 400, "Invalid referenceId");
    }

    const record = await OutputFeedback.findOne({
      userId: req.user.id,
      type,
      referenceId: referenceId.trim(),
    }).lean();

    return res.json({ vote: record?.vote || null });
  } catch (err) {
    return sendErr(req, res, 500, "Failed to fetch feedback");
  }
};

module.exports = { submitOutputFeedback, getOutputFeedback };
