const mongoose = require("mongoose");

const LeaveRequestSchema = new mongoose.Schema({
  
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    leaveType: {
      type: String,
      enum: [
        "ANNUAL",
        "MARRIAGE",
        "CHILD_MARRIAGE",
        "FUNERAL",
        "MILITARY_EXAM",
        "WORK_ACCIDENT",
        "FOREIGN_VISIT",
        "SICK",
        "MATERNITY",
        "PERSONAL",
      ],
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    totalDays: {
      type: Number,
      default: 0
    },

    reason: String,

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "CANCELLED"
      ],
      default: "PENDING"
    },

    isPaidLeave: {
      type: Boolean,
      default: false
    },

    // chỉ cho nghỉ bệnh
    medicalProof: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },

    approvedAt: Date,
    
    rejectedReason: String,

    note: String

  },
  {
    timestamps: true
  });

module.exports = mongoose.model("LeaveRequest", LeaveRequestSchema);