// Minimal JSON logger (keeps stdout parsable)
function log(requestId, stage, extra = {}) {
  try {
    console.log(JSON.stringify({
      ts: new Date().toISOString(),
      requestId,
      stage,
      ...extra,
    }));
  } catch (_) {
    // swallow logging errors
  }
}
module.exports = { log };