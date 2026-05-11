const DepartmentService = require("../../services/Admin/DepartmentSer");
const LeaveService = require("../../services/Admin/LeaveSer");

const createLeaveRequest = async (req, res) => {
  try {
    const result = await LeaveService.createLeaveRequestService(req.body);

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

// const updateLeaveRequest = async (req, res) => {
//   try {
//     const result =
//       await LeaveService
//         .updateLeaveRequestService(
//           req.params.id,
//           req.body
//         );
//     if (result.status === "ERROR") {
//       return res.status(400).json(result);
//     }
//     return res.status(200).json(result);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: "ERROR",
//       message: "Server error"
//     });
//   }
// };

// const deleteLeaveRequest = async (req, res) => {
//   try {
//     const result =
//       await LeaveService
//         .deleteLeaveRequestService(
//           req.params.id
//         );
//     if (result.status === "ERROR") {
//       return res.status(400).json(result);
//     }

//     return res.status(200).json(result);

//   } catch (error) {
//     return res.status(500).json({
//       status: "ERROR",
//       message: "Server error"
//     });
//   }
// };

module.exports = {
  createLeaveRequest,
  getLeaveRequests,
  // updateLeaveRequest,
  // deleteLeaveRequest
};