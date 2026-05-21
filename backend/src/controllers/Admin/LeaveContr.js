const DepartmentService = require("../../services/Admin/DepartmentSer");
const LeaveService = require("../../services/Admin/LeaveSer");

const createLeaveRequest = async (req, res) => {
  try {
    const result = await LeaveService.createLeaveRequestService({
      ...req.body,
       medicalProof:
          req.file
            ? {
                fileName:
                  req.file.filename
              }
            : null
    });

    if (result.status === "ERROR") {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERROR",
      message: "Server error"
    });
  }
};

const getLeaveRequests = async (req, res) => {
  try {
    const result =  await LeaveService.getLeaveRequestsService();

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
    const result =  await LeaveService.getHistoryLeaveRequestsService();

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

const updateLeaveRequest = async (req, res) => {

    try {

      const result =
        await LeaveService.updateLeaveRequestService(

          req.params.id,

          {
            ...req.body,

            medicalProof:
              req.file
                ? {
                    fileName:
                      req.file.filename
                  }
                : undefined
          }
        );

      if (result.status === "ERROR") {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {

      return res.status(500).json({
        status: "ERROR",
        message: error.message
      });
    }
};

const deleteLeaveRequest = async (req, res) => {
  try {
    const result =
      await LeaveService
        .deleteLeaveRequestService(
          req.params.id
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

const approveLeaveRequest = async (req, res) => {
  try {
    const result =
      await LeaveService.approveLeaveRequestService(
        req.params.id
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
    const result =
      await LeaveService.rejectLeaveRequestService(
        req.params.id
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
  createLeaveRequest,
  getLeaveRequests,
  updateLeaveRequest,
  deleteLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getHistoryLeaveRequests
};