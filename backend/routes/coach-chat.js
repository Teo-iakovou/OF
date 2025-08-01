const express = require("express");
const router = express.Router();
const { coachChatHandler } = require("../controllers/coachChatController");

router.post("/", coachChatHandler);
module.exports = router;
