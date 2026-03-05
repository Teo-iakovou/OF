const express = require("express");
const { debugWhoami, repairFaceId } = require("../controllers/debugController");

const router = express.Router();

router.get("/whoami", debugWhoami);
router.post("/repair-faceid", repairFaceId);

module.exports = router;
