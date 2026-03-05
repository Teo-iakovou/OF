const express = require("express");
const { postRecommendationFeedback } = require("../controllers/recommendationsController");

const router = express.Router();

router.post("/feedback", postRecommendationFeedback);

module.exports = router;
