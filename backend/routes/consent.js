const express = require("express");
const crypto = require("crypto");
const ConsentLog = require("../models/consentLog");

const router = express.Router();

const IP_SALT = process.env.CONSENT_IP_SALT || "echofy-consent-fallback-salt-change-me";

function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash("sha256").update(`${IP_SALT}:${ip}`).digest("hex").slice(0, 32);
}

router.post("/", async (req, res) => {
  try {
    const { categories, version, locale, gpc, action } = req.body || {};

    if (!categories || typeof categories !== "object") {
      return res.status(400).json({ error: "INVALID_PAYLOAD" });
    }
    if (!version) {
      return res.status(400).json({ error: "MISSING_VERSION" });
    }

    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded?.split(",")[0]?.trim() || req.socket?.remoteAddress || null;

    // Combine client-reported GPC with server-detected sec-gpc header
    const serverGpc = req.headers["sec-gpc"] === "1" || req.headers["gpc"] === "1";

    const log = await ConsentLog.create({
      userId: req.user?._id ?? null,
      categories: {
        necessary: true,
        analytics: !!categories.analytics,
        marketing: !!categories.marketing,
      },
      version: String(version).slice(0, 20),
      locale: locale ? String(locale).slice(0, 10) : null,
      gpc: !!(gpc || serverGpc),
      ipHash: hashIp(ip),
      userAgent: (req.headers["user-agent"] || "").slice(0, 500),
      action: ["granted", "updated", "withdrawn"].includes(action) ? action : "granted",
    });

    return res.status(200).json({ ok: true, consentId: log._id });
  } catch (err) {
    console.error("[consent] persist failed", err);
    // Fail open — never block user navigation because we can't write a log
    return res.status(200).json({ ok: false });
  }
});

module.exports = router;
