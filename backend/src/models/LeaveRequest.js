const mongoose = require("mongoose");

const LeaveRequestSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },

  leaveType: {
    type: String,
    enum: ["SICK", "ANNUAL", "UNPAID", "EMERGENCY"],
    required: true
  },

  startDate: Date,
  endDate: Date,

  reason: String,

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },

  // 🔥 chỉ dùng cho SICK
  proofStatus: {
    type: String,
    enum: ["SUBMITTING", "SUBMITTED", "APPROVED", "REJECTED"],
    default: null
  },

  proofDueDate: Date
}, { timestamps: true });

module.exports = mongoose.model(
  "LeaveRequest",
  LeaveRequestSchema
);