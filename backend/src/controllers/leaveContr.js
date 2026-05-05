// controllers/leave.controller.js

import LeaveRequest from "../models/LeaveRequest.js";

export const createLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    const leave = new LeaveRequest({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason
    });

    await leave.save();

    res.json(leave);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const approveLeave = async (req, res) => {
  const { id } = req.params;

  const leave = await LeaveRequest.findById(id);

  if (!leave) return res.status(404).send("Not found");

  leave.status = "APPROVED";

  // 🔥 nếu sick → set deadline 3 ngày
  if (leave.leaveType === "SICK") {
    const due = new Date();
    due.setDate(due.getDate() + 3);

    leave.proofStatus = "SUBMITTING";
    leave.proofDueDate = due;
  }

  await leave.save();

  res.json(leave);
};

export const rejectLeave = async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id);

  leave.status = "REJECTED";

  await leave.save();

  res.json(leave);
};