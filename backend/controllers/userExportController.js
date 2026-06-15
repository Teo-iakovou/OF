const { exportUserData } = require("../services/userDataExport");

exports.requestDataExport = async (req, res) => {
  try {
    const userId = String(req.user.id);
    const data = await exportUserData(userId);

    const filename = `echofy-export-${data.exportFor.email.replace(/[^a-z0-9]/gi, "_")}-${new Date().toISOString().slice(0, 10)}.json`;

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[dataExport]", err);
    return res.status(500).json({ error: "EXPORT_FAILED" });
  }
};
