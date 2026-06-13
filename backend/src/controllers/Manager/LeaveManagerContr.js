const LeaveService = require("../../services/Manager/LeaveSer");

const getLeaveRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const result =  await LeaveService.getLeaveRequestsService(userId);

    if (result.status === "ERROR") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Server error"
    });
  }
};

const getHistoryLeaveRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const result =  await LeaveService.getHistoryLeaveRequestsService(userId);

    if (result.status === "ERROR") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Server error"
    });
  }
};

const approveLeaveRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await LeaveService.approveLeaveRequestService(
        req.params.id,
        userId
      );
    if (result.status === "ERROR") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Server error"
    });
  }
};

const rejectLeaveRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rejectReason } = req.body;
    const result = await LeaveService.rejectLeaveRequestService(
        req.params.id,
        rejectReason,
        userId
      );
    if (result.status === "ERROR") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Server error"
    });
  }
};

module.exports = {
  getLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  getHistoryLeaveRequests
};