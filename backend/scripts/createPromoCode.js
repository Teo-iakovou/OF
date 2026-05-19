/**
 * Create or list promo codes in MongoDB — CLI convenience for dev/ops use.
 *
 * Usage:
 *   MONGO_URI=<uri> node backend/scripts/createPromoCode.js --plan pro
 *   MONGO_URI=<uri> node backend/scripts/createPromoCode.js --plan lite --max-uses 50 --expires 2026-12-31 --note "soft launch"
 *   MONGO_URI=<uri> node backend/scripts/createPromoCode.js --plan ultimate --code FRIEND2026
 *   MONGO_URI=<uri> node backend/scripts/createPromoCode.js --list
 *
 * Options:
 *   --plan <lite|pro|ultimate>   (required unless --list)
 *   --code <CODE>                use this exact code (auto-generated if omitted)
 *   --max-uses <n|unlimited>     default: 1
 *   --expires <YYYY-MM-DD|ISO>   end-of-day UTC for date-only; null if omitted
 *   --note <text>                admin memo
 *   --list                       print all existing codes and exit
 */

const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const PromoCode = require("../models/promoCode");
const { generatePromoCode } = require("../utils/generatePromoCode");

const VALID_PLAN_KEYS = new Set(["lite", "pro", "ultimate"]);

// ── Arg parsing ────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  const raw = argv.slice(2);
  for (let i = 0; i < raw.length; i++) {
    const token = raw[i];
    if (token === "--list") { args.list = true; continue; }
    const next = raw[i + 1];
    if (token === "--plan")      { args.plan      = next; i++; continue; }
    if (token === "--code")      { args.code      = next; i++; continue; }
    if (token === "--max-uses")  { args.maxUses   = next; i++; continue; }
    if (token === "--expires")   { args.expires   = next; i++; continue; }
    if (token === "--note")      { args.note      = next; i++; continue; }
    console.error(`Unknown argument: ${token}`);
    process.exit(1);
  }
  return args;
}

// ── Date helpers ───────────────────────────────────────────────────────────

function parseExpires(raw) {
  if (!raw) return null;
  // "YYYY-MM-DD" → end of that day in UTC (23:59:59Z)
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
  const parsed = dateOnly ? new Date(`${raw}T23:59:59.000Z`) : new Date(raw);
  if (isNaN(parsed.getTime())) {
    console.error(`Invalid date: "${raw}". Use YYYY-MM-DD or a full ISO timestamp.`);
    process.exit(1);
  }
  if (parsed <= new Date()) {
    console.error(`Expiry date is in the past: ${parsed.toISOString()}`);
    process.exit(1);
  }
  return parsed;
}

// ── Formatting helpers ─────────────────────────────────────────────────────

function fmtMaxUses(maxUses) {
  if (maxUses === null) return "unlimited";
  if (maxUses === 1)    return "1 (one-time)";
  return String(maxUses);
}

function fmtExpires(expiresAt) {
  return expiresAt ? expiresAt.toISOString() : "never";
}

// ── List mode ──────────────────────────────────────────────────────────────

async function listCodes() {
  const codes = await PromoCode.find({}).sort({ createdAt: -1 }).lean();
  if (codes.length === 0) {
    console.log("No promo codes found.");
    return;
  }
  console.log(`\n${"CODE".padEnd(14)} ${"PLAN".padEnd(9)} ${"USES".padEnd(12)} ${"ACTIVE".padEnd(7)} EXPIRES`);
  console.log("-".repeat(70));
  for (const c of codes) {
    const uses = c.maxUses === null ? `${c.usedCount}/∞` : `${c.usedCount}/${c.maxUses}`;
    console.log(
      `${c.code.padEnd(14)} ${c.planKey.padEnd(9)} ${uses.padEnd(12)} ${String(c.active).padEnd(7)} ${fmtExpires(c.expiresAt)}`
    );
    if (c.note) console.log(`${"".padEnd(14)} note: ${c.note}`);
  }
  console.log();
}

// ── Main ───────────────────────────────────────────────────────────────────

async function run() {
  const args = parseArgs(process.argv);

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is required");
    process.exit(1);
  }

  // Validate all args before connecting to DB (matches grantAdmin.js pattern)
  if (!args.list) {
    if (!args.plan) {
      console.error("--plan is required. Values: lite | pro | ultimate");
      process.exit(1);
    }
    if (!VALID_PLAN_KEYS.has(String(args.plan).toLowerCase())) {
      console.error(`Invalid plan "${args.plan}". Must be one of: lite, pro, ultimate`);
      process.exit(1);
    }
    if (args.maxUses !== undefined && String(args.maxUses).toLowerCase() !== "unlimited") {
      const n = Number(args.maxUses);
      if (!Number.isInteger(n) || n < 1) {
        console.error(`Invalid --max-uses "${args.maxUses}". Must be a positive integer or "unlimited".`);
        process.exit(1);
      }
    }
    // parseExpires calls process.exit(1) internally on bad input
    parseExpires(args.expires || null);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB:", mongoose.connection.name, "@", mongoose.connection.host);

  if (args.list) {
    await listCodes();
    await mongoose.disconnect();
    return;
  }

  const planKey = String(args.plan).toLowerCase();

  // Resolve code
  let code;
  if (args.code) {
    code = String(args.code).trim().toUpperCase();
    const existing = await PromoCode.findOne({ code }).lean();
    if (existing) {
      console.error(`Code already exists: ${code}`);
      await mongoose.disconnect();
      process.exit(1);
    }
  } else {
    code = generatePromoCode(12);
  }

  // Resolve maxUses
  let maxUses = 1;
  if (args.maxUses !== undefined) {
    if (String(args.maxUses).toLowerCase() === "unlimited") {
      maxUses = null;
    } else {
      maxUses = Number(args.maxUses); // already validated above
    }
  }

  // Resolve expiresAt (re-parse after validation; parseExpires is pure)
  const expiresAt = parseExpires(args.expires || null);

  const note = typeof args.note === "string" ? args.note.trim() : "";

  const promo = await PromoCode.create({
    code,
    planKey,
    maxUses,
    expiresAt,
    note,
    createdBy: null,
  });

  console.log(`
✅ Promo code created

   Code:      ${promo.code}
   Plan:      ${promo.planKey}
   Max uses:  ${fmtMaxUses(promo.maxUses)}
   Expires:   ${fmtExpires(promo.expiresAt)}
   Note:      ${promo.note || "(none)"}

   Share this code with the user. They enter it at checkout.
`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Failed:", err.message || err);
  process.exit(1);
});
