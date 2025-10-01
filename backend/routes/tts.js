const express = require("express");
const router = express.Router();
const { synthesizePost, synthesizeGet, synthesizeAndStore } = require("../controllers/ttsController");

router.post("/", synthesizePost);
router.get("/", synthesizeGet);
router.post("/store", synthesizeAndStore);

module.exports = router;
