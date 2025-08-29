function makeRid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}
function requestId(req, res, next) {
  const rid = req.headers["x-request-id"] || makeRid();
  req.requestId = rid;
  res.setHeader("x-request-id", rid);
  next();
}
module.exports = { requestId };