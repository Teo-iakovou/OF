// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  purchasedPackage: {
    type: String,
    enum: ["lite", "pro", "ultimate", null],
    default: null,
  },
  uploadLimit: {
    type: Number,
    default: 10, // default for lite
  },
  uploadsUsed: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
