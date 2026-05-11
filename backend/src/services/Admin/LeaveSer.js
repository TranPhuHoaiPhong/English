const LeaveRequest = require("../../models/LeaveRequest");

const createLeaveRequestService = async (data) => {
  const { employeeId, leaveType, startDate, endDate, reason } = data;

  if ( !employeeId || !leaveType || !startDate || !endDate ) {
    return {
      status: "ERROR",
      message:
        "Missing required fields"
    };
  }

  if( new Date(startDate) > new Date(endDate)) {
    return {
      status: "ERROR",
      message: "Start date must be before end date"
    };
  }

  const newLeaveRequest =
    await LeaveRequest.create({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,

      // nếu là nghỉ bệnh
      proofStatus:
        leaveType === "SICK"
          ? "SUBMITTING"
          : null,

      proofDueDate:
        leaveType === "SICK"
          ? new Date(
              Date.now() +
              3 * 24 * 60 * 60 * 1000
            )
          : null
    });

  return {
    status: "SUCCESS",
    data: newLeaveRequest
  };
};

const getLeaveRequestsService = async () => {
  const leaverequests = await LeaveRequest.find();
  return {
    status: "SUCCESS",
    data: leaverequests
  };
};

// const updateDepartmentService = async (id, data) => {
//     const { name, status } = data;

//     if (!name) {
//       return {
//         status: "ERROR",
//         message:
//           "Department name is required"
//       };
//     }

//     const department = await Department.findById(id);

//     if (!department) {
//       return {
//         status: "ERROR",
//         message:
//           "Department not found"
//       };
//     }

//     const existingDepartment =
//       await Department.findOne({
//         name,
//         _id: { $ne: id }
//       });

//     if (existingDepartment) {
//       return {
//         status: "ERROR",
//         message:
//           "Department already exists"
//       };
//     }

//     const updatedDepartment =
//       await Department.findByIdAndUpdate(
//         id,
//         {
//           name,
//           status
//         },
//         {
//           returnDocument: "after"
//         }
//       );

//     return {
//       status: "SUCCESS",
//       data: updatedDepartment
//     };
//   };

// const deleteDepartmentService = async (id) => {
//     const department = await Department.findById(id);

//     if (!department) {
//       return {
//         status: "ERROR",
//         message:
//           "Department not found"
//       };
//     }

//      const employeeExists =
//       await Employee.findOne({
//         department: id
//       });

//     if (employeeExists) {

//       return {
//         status: "ERROR",
//         message:
//           "Can not delete department because employees still exist"
//       };
//     }

//     await Department.findByIdAndDelete(id);

//     return {
//       status: "SUCCESS",
//       message: "Delete department success"
//     };
//   };

module.exports = {
  createLeaveRequestService,
  getLeaveRequestsService,
  // updateLeaveRequestService,
  // deleteLeaveRequestService
};