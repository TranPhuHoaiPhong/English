const LeaveRequest = require("../../models/LeaveRequest");
const Employee = require("../../models/Employee");
const CompanyHoliday = require("../../models/CompanyHoliday");

const createLeaveRequestService = async (data) => {
    const { employeeId, leaveType, startDate, endDate, reason, medicalProof } = data;

    // ===== validate =====

    if ( !employeeId || !leaveType || !startDate || !endDate) {
      return {
        status: "ERROR",
        message: "Missing required fields"
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return {
        status: "ERROR",
        message: "Start date must be before end date"
      };
    }

    // ===== employee =====

    const employee = await Employee.findById( employeeId );

    if (!employee) {
      return {
        status: "ERROR",
        message: "Employee not found"
      };
    }

    // ===== tính số ngày =====

    let totalDays = 0;

    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();

      // bỏ chủ nhật
      if (day !== 0) {

        // check holiday
        const holiday = await CompanyHoliday
            .findOne({
              startDate: {
                $lte: current
              },

              endDate: {
                $gte: current
              }
            });

        // không phải holiday

        if (!holiday) {
          totalDays++;
        }
      }

      current.setDate(
        current.getDate() + 1
      );
    }

    if (totalDays <= 0) {
      return {
        status: "ERROR",
        message: "Selected dates are all holidays or Sundays"
      };
    }

    // ===== nghỉ có lương =====

    const paidLeaveTypes = [
      "ANNUAL",
      "MARRIAGE",
      "CHILD_MARRIAGE",
      "FUNERAL",
      "MILITARY_EXAM",
      "WORK_ACCIDENT",
      "FOREIGN_VISIT"
    ];

    const isPaidLeave = paidLeaveTypes.includes(leaveType);

    // ===== annual leave =====

    if (leaveType === "ANNUAL") {
      if ( employee.leaveBalance < totalDays ) {
        return {
          status: "ERROR",
          message:
            "Not enough leave balance"
        };
      }

      // trừ phép

      employee.leaveBalance -= totalDays;
      await employee.save();
    }

    // ===== nghỉ bệnh =====

    if ( leaveType === "SICK" && !medicalProof ) {
      return {
        status: "ERROR",
        message: "Medical proof is required for sick leave"
      };
    }

    // ===== create =====

    const newLeaveRequest = await LeaveRequest.create({
        employeeId,
        leaveType,
        startDate,
        endDate,
        totalDays,
        reason,
        isPaidLeave,
        medicalProof:
          leaveType === "SICK"
            ? medicalProof
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