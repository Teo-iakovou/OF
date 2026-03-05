const cookie = require("cookie");

const isStaticPath = (path) =>
  path.startsWith("/_next") ||
  path.startsWith("/static") ||
  path.startsWith("/assets") ||
  path.startsWith("/images") ||
  path === "/favicon.ico";

function requestLogger(req, _res, next) {
  if (process.env.NODE_ENV === "production") return next();
  const path = req.path || req.originalUrl || "";
  if (isStaticPath(path)) return next();
  const header = req.headers["cookie"] || "";
  const cookies = header ? cookie.parse(header) : {};
  const hasCookie = Object.keys(cookies).length > 0;
  const payload = {
    requestId: req.requestId || null,
    path,
    method: req.method,
    hasCookie,
    userId: req.user?.id || null,
    email: req.user?.email || null,
  };
  try {
    console.log("[req]", payload);
  } catch {}
  return next();
}

module.exports = { requestLogger };
