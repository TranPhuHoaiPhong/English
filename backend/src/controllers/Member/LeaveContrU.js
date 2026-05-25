const LeaveService = require("../../services/Member/LeaveSerU");

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


module.exports = {
  createLeaveRequest,
};