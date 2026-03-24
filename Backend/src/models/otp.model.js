// models/otp.model.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0 // ⏱️ TTL index (auto delete when time passes)
  }
}, { timestamps: true });

export default mongoose.model("Otp", otpSchema);