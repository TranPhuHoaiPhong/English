// controllers/proof.controller.js

import MedicalProof from "../models/MedicalProof.js";
import LeaveRequest from "../models/LeaveRequest.js";

export const uploadProof = async (req, res) => {
  const { leaveRequestId, fileUrl } = req.body;

  const proof = new MedicalProof({
    leaveRequestId,
    fileUrl
  });

  await proof.save();

  // 🔥 update leave
  await LeaveRequest.findByIdAndUpdate(leaveRequestId, {
    proofStatus: "SUBMITTED"
  });

  res.json(proof);
};

export const approveProof = async (req, res) => {
  const { id } = req.params;

  const proof = await MedicalProof.findById(id);

  proof.status = "APPROVED";
  await proof.save();

  await LeaveRequest.findByIdAndUpdate(proof.leaveRequestId, {
    proofStatus: "APPROVED"
  });

  res.json(proof);
};

export const rejectProof = async (req, res) => {
  const proof = await MedicalProof.findById(req.params.id);

  proof.status = "REJECTED";
  await proof.save();

  await LeaveRequest.findByIdAndUpdate(proof.leaveRequestId, {
    proofStatus: "REJECTED"
  });

  res.json(proof);
};