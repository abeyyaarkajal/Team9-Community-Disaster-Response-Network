const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    enum: ["flood", "fire", "injury", "missing", "roadblock", "other"],
    required: true
  },
  description: String,
  image: String,
  location: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ["pending", "assigned", "resolved"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Incident", incidentSchema);
