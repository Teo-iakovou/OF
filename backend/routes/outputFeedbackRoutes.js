const express = require("express");
const router = express.Router();
const {
  submitOutputFeedback,
  getOutputFeedback,
} = require("../controllers/outputFeedbackController");

router.post("/", submitOutputFeedback);
router.get("/", getOutputFeedback);

module.exports = router;
