const mongoose = require("mongoose");

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseMongoUriMeta = (uri) => {
  if (!uri) return { hasMongoUri: false, host: null, protocol: null, dbName: null, atCount: 0 };
  const atCount = (uri.match(/@/g) || []).length;
  try {
    const parsed = new URL(uri);
    return {
      hasMongoUri: true,
      host: parsed.host || null,
      protocol: parsed.protocol || null,
      dbName: parsed.pathname ? parsed.pathname.replace(/^\//, "") || null : null,
      atCount,
    };
  } catch {
    const hostMatch = uri.match(/@([^/?]+)/);
    const protoMatch = uri.match(/^(mongodb\+srv:|mongodb:)/i);
    const dbMatch = uri.match(/\/([^/?]+)(\?|$)/);
    return {
      hasMongoUri: true,
      host: hostMatch ? hostMatch[1] : null,
      protocol: protoMatch ? protoMatch[1] : null,
      dbName: dbMatch ? dbMatch[1] : null,
      atCount,
    };
  }
};

const classifyMongoError = (err) => {
  const message = `${err?.name || ""} ${err?.message || ""}`.toLowerCase();
  if (message.includes("authentication failed") || err?.code === 18) {
    return {
      category: "auth",
      hint: "Mongo credentials are invalid (user/password) or user lacks DB permissions.",
    };
  }
  if (
    message.includes("querysrv") ||
    message.includes("enotfound") ||
    message.includes("eai_again")
  ) {
    return {
      category: "dns",
      hint: "DNS resolution failed for Atlas host. Verify SRV URI and DNS/network egress.",
    };
  }
  if (
    message.includes("tls") ||
    message.includes("ssl") ||
    message.includes("certificate")
  ) {
    return {
      category: "tls",
      hint: "TLS handshake/certificate issue. Verify Atlas URI and runtime CA trust.",
    };
  }
  if (message.includes("timed out") || message.includes("server selection timed out")) {
    return {
      category: "timeout",
      hint: "Server selection timeout. Usually Atlas reachability/network access issue.",
    };
  }
  if (
    message.includes("replicasetnoprimary") ||
    message.includes("could not connect to any servers") ||
    message.includes("whitelist")
  ) {
    return {
      category: "network_access",
      hint: "Atlas network access or cluster availability issue (IP access list, paused cluster, wrong project/host).",
    };
  }
  return {
    category: "unknown",
    hint: "Unclassified Mongo startup error. Inspect full error payload.",
  };
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "";
  const retryMax = toInt(process.env.MONGO_CONNECT_RETRIES, 5);
  const baseDelayMs = toInt(process.env.MONGO_CONNECT_RETRY_DELAY_MS, 2000);
  const serverSelectionTimeoutMS = toInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS, 10000);
  const meta = parseMongoUriMeta(uri);

  console.log("[mongo] startup config", {
    hasMongoUri: meta.hasMongoUri,
    protocol: meta.protocol,
    host: meta.host,
    dbName: meta.dbName,
    retryMax,
    serverSelectionTimeoutMS,
  });

  if (meta.atCount > 1) {
    console.warn(
      "[mongo] URI contains multiple '@' symbols. This usually means password contains unencoded special characters."
    );
  }

  if (!uri) {
    const err = new Error("MONGO_URI is not set");
    err.code = "MONGO_URI_MISSING";
    throw err;
  }

  let lastErr = null;
  for (let attempt = 1; attempt <= retryMax; attempt += 1) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS });
      console.log("🟢 Mongo connected");
      console.log("DB name:", mongoose.connection.name);
      console.log("Host:", mongoose.connection.host);
      return;
    } catch (err) {
      lastErr = err;
      const diag = classifyMongoError(err);
      const reasonType = err?.reason?.type || null;
      const code = typeof err?.code !== "undefined" ? err.code : null;

      console.error("[mongo] connection attempt failed", {
        attempt,
        retryMax,
        category: diag.category,
        hint: diag.hint,
        reasonType,
        code,
        message: err?.message || String(err),
      });

      if (attempt < retryMax) {
        const waitMs = baseDelayMs * attempt;
        console.log("[mongo] retrying connection", { inMs: waitMs, nextAttempt: attempt + 1 });
        await delay(waitMs);
      }
    }
  }

  throw lastErr || new Error("Mongo connection failed after retries");
};

module.exports = connectDB;
