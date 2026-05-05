import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },

  leaveType: {
    type: String,
    enum: ["SICK", "ANNUAL", "UNPAID", "OTHER"]
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

export default mongoose.model("LeaveRequest", LeaveRequestSchema);