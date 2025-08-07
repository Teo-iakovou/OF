const express = require("express");
const router = express.Router();
const {
  getConversations,
  getConversationById,
  deleteConversation,
  generateTitle,
  createConversation,
} = require("../controllers/conversationController");

router.post("/:id/generate-title", generateTitle);
router.post("/", createConversation); 
router.get("/", getConversations);
router.get("/:id", getConversationById);
router.delete("/:id", deleteConversation);

module.exports = router;
