import mongoose from "mongoose";

const MedicalProofSchema = new mongoose.Schema({
  leaveRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeaveRequest"
  },

  fileUrl: String,

  status: {
    type: String,
    enum: ["SUBMITTED", "APPROVED", "REJECTED"],
    default: "SUBMITTED"
  }
}, { timestamps: true });

export default mongoose.model("MedicalProof", MedicalProofSchema);