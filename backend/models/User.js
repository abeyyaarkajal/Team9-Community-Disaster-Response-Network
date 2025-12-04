const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["citizen", "volunteer", "authority", "ngo"],
    required: true
  },
  otp: String,
  verified: { type: Boolean, default: false },
  location: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model("User", userSchema);
