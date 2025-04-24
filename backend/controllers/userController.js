// controllers/userController.js
const User = require("../models/user");
const Result = require("../models/result");

const getUserDashboard = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const uploadsRemaining = user.uploadLimit - user.uploadsUsed;

    // Fetch recent analysis results (limit to 5–10 for now)
    const recentResults = await Result.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      email: user.email,
      package: user.purchasedPackage,
      uploadsUsed: user.uploadsUsed,
      uploadsRemaining: uploadsRemaining < 0 ? 0 : uploadsRemaining,
      recentResults,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

const PACKAGE_LIMITS = {
  lite: 10,
  pro: 50,
  ultimate: 9999,
};

const purchasePackage = async (req, res) => {
  const { email, packageId } = req.body;

  if (!email || !packageId) {
    return res.status(400).json({ error: "Email and package ID required" });
  }

  try {
    let user = await User.findOne({ email });

    const uploadLimit = PACKAGE_LIMITS[packageId] || 0;

    if (!user) {
      user = new User({
        email,
        purchasedPackage: packageId,
        uploadLimit,
        uploadsUsed: 0,
      });
    } else {
      user.purchasedPackage = packageId;
      user.uploadLimit = uploadLimit;
    }

    await user.save();
    res.json({ message: "Package purchased successfully!", user });
  } catch (error) {
    console.error("Error purchasing package:", error);
    res.status(500).json({ error: "Purchase failed" });
  }
};

const checkUserPackage = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.purchasedPackage) {
      return res.json({ hasAccess: false });
    }

    const uploadsRemaining = user.uploadLimit - user.uploadsUsed;

    res.json({
      hasAccess: true,
      package: user.purchasedPackage,
      uploadsUsed: user.uploadsUsed,
      uploadLimit: user.uploadLimit,
      uploadsRemaining: uploadsRemaining < 0 ? 0 : uploadsRemaining,
    });
  } catch (error) {
    console.error("Error checking package:", error);
    res.status(500).json({ error: "Failed to check package" });
  }
};

module.exports = { purchasePackage, checkUserPackage, getUserDashboard };
