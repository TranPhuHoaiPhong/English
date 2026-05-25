const LeaveRequest = require("../../models/LeaveRequest");
const Employee = require("../../models/Employee");
const CompanyHoliday = require("../../models/CompanyHoliday");

const createLeaveRequestService = async (data) => {

  const { employeeId, leaveType, startDate, endDate, reason, medicalProof } = data;

  // ===== validate =====

  if (
    !employeeId ||
    !leaveType ||
    !startDate ||
    !endDate
  ) {

    return {
      status: "ERROR",
      message:
        "Missing required fields"
    };
  }

  const start =
  new Date(startDate + "T00:00:00");

const end =
  new Date(endDate + "T00:00:00");

  // reset time
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (start > end) {

    return {
      status: "ERROR",
      message:
        "Start date must be before end date"
    };
  }

  // ===== employee =====

  const employee =
    await Employee.findById(
      employeeId
    );

  if (!employee) {

    return {
      status: "ERROR",
      message:
        "Employee not found"
    };
  }

  // ===== tính ngày nghỉ =====

  let totalDays = 0;

  const current =
    new Date(start);

  while (current <= end) {

    const currentDate =
      new Date(current);

    currentDate.setHours(
      0,
      0,
      0,
      0
    );

    // sunday
    const isSunday =
      currentDate.getDay() === 0;

    // start of day
    const startOfDay =
      new Date(currentDate);

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    // end of day
    const endOfDay =
      new Date(currentDate);

    endOfDay.setHours(
      23,
      59,
      59,
      999
    );

    // holiday
    const holiday = await CompanyHoliday.findOne({
        startDate: {
          $lte: endOfDay
        },

        endDate: {
          $gte: startOfDay
        }
      }).lean();

    // console.log({

    //   date:
    //     currentDate
    //       .toLocaleDateString(),

    //   isSunday,

    //   holiday:
    //     holiday?.name
    // });

    // count only workday
    if (
      !isSunday &&
      !holiday
    ) {

      totalDays++;
    }

    // next day
    current.setDate(
      current.getDate() + 1
    );
  }

  // ===== check total =====

  if (totalDays <= 0) {

    return {
      status: "ERROR",
      message:
        "Selected dates are all holidays or Sundays"
    };
  }

  // ===== paid leave =====

  const paidLeaveTypes = [

    "ANNUAL",

    "MARRIAGE",

    "CHILD_MARRIAGE",

    "FUNERAL",

    "MILITARY_EXAM",

    "WORK_ACCIDENT",

    "FOREIGN_VISIT"
  ];

  const isPaidLeave =
    paidLeaveTypes.includes(
      leaveType
    );

  // ===== annual leave =====

  if (
    leaveType ===
    "ANNUAL"
  ) {

    if (
      employee.leaveBalance <
      totalDays
    ) {

      return {
        status: "ERROR",
        message:
          "Not enough leave balance"
      };
    }

    // trừ phép

    employee.leaveBalance -=
      totalDays;

    await employee.save();
  }

  // ===== sick leave =====

  if (
    leaveType === "SICK" &&
    !medicalProof
  ) {

    return {
      status: "ERROR",
      message:
        "Medical proof is required for sick leave"
    };
  }

  // ===== create =====

  const newLeaveRequest =
    await LeaveRequest.create({

      employeeId,

      // thêm code + name

      employeeCode:
        employee.code,

      employeeName:
        employee.name,

      leaveType,

      startDate,

      endDate,

      totalDays,

      reason,

      isPaidLeave,

      medicalProof:

        leaveType ===
        "SICK"

          ? medicalProof

          : null
    });

  return {

    status: "SUCCESS",

    data: newLeaveRequest
  };
};

module.exports = {
  createLeaveRequestService
};