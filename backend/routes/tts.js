const express = require("express");
const router = express.Router();
const { synthesizePost, synthesizeGet } = require("../controllers/ttsController");

router.post("/", synthesizePost);
router.get("/", synthesizeGet);

module.exports = router;
