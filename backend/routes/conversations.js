const express = require("express");
const router = express.Router();
const {
  getConversations,
  getConversationById,
  deleteConversation,
} = require("../controllers/conversationController");

router.get("/", getConversations);
router.get("/:id", getConversationById);
router.delete("/:id", deleteConversation);

module.exports = router;
