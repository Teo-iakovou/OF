// const mongoose = require("mongoose");

// const recommendationSchema = new mongoose.Schema({
//   gender: {
//     type: String,
//     enum: ["man", "woman", "non-binary", "any"],
//     required: false,
//   },
//   bodyType: {
//     type: String,
//     enum: ["muscular", "slim", "athletic", "curvy", "petite", "any"],
//     required: false,
//   },
//   emotion: { type: String, required: true },
//   skinTone: {
//     type: String,
//     enum: ["light", "medium", "dark", "tan", "pale", "any"],
//     required: false,
//   },
//   clothingStyle: {
//     type: String,
//     enum: ["casual", "formal", "athletic", "any"],
//     required: false,
//   },
//   accessories: { type: [String], required: false }, // Array like ['glasses', 'hat']
//   backgroundSettings: {
//     type: String,
//     enum: ["indoor", "outdoor", "studio", "any"],
//     required: false,
//   },
//   bestPose: { type: String, required: false },
//   lightingTips: { type: String, required: false },
//   captionIdeas: { type: [String], required: false },
//   hashtagSuggestions: { type: [String], required: false },
//   platforms: [{ name: String, bestPostTime: String }],
// });

// module.exports = mongoose.model("Recommendation", recommendationSchema);
