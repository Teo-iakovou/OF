const User = require("../models/user");

// Must run AFTER requireAuth (req.user.id must be set).
// Always fetches isAdmin fresh from DB — never trusts the JWT.
async function requireAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("+isAdmin");
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  } catch {
    return res.status(403).json({ error: "Forbidden" });
  }
}

module.exports = { requireAdmin };
