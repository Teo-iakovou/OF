const express = require("express");
const router = express.Router();
const { guardActiveInstanceAndFace } = require("../middleware/guardActiveInstanceAndFace");
const {
  getConversations,
  getConversationById,
  deleteConversation,
  generateTitle,
  createConversation,
  summarizeConversation,
} = require("../controllers/conversationController");

router.use(guardActiveInstanceAndFace({ requireFaceEnrolled: true }));

router.post("/:id/generate-title", generateTitle);
router.post("/:id/summarize", summarizeConversation);
router.post("/", createConversation); 
router.get("/", getConversations);
router.get("/:id", getConversationById);
router.delete("/:id", deleteConversation);

module.exports = router;
