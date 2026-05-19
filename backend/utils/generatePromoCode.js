const crypto = require("crypto");

// 32-character set: uppercase letters + digits, visually unambiguous
// (no O/0, I/1 confusion). 256 / 32 = 8 exactly — zero modulo bias.
const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generatePromoCode(length = 12) {
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes)
    .map((b) => CHARSET[b % 32])
    .join("");
}

module.exports = { generatePromoCode };
