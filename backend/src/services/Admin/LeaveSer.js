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

const getLeaveRequestsService = async () => {
  const leaverequests = await LeaveRequest.find();
  return {
    status: "SUCCESS",
    data: leaverequests
  };
};

const updateLeaveRequestService = async (
  id,
  data
) => {

  const {
    employeeId,
    leaveType,
    startDate,
    endDate,
    reason,
    medicalProof
  } = data;

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

  // ===== find request =====

  const leaveRequest =
    await LeaveRequest.findById(id);

  if (!leaveRequest) {

    return {
      status: "ERROR",
      message:
        "Leave request not found"
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

  // ===== date =====

  const start =
    new Date(
      startDate +
      "T00:00:00"
    );

  const end =
    new Date(
      endDate +
      "T00:00:00"
    );

  start.setHours(
    0, 0, 0, 0
  );

  end.setHours(
    0, 0, 0, 0
  );

  if (start > end) {

    return {
      status: "ERROR",
      message:
        "Start date must be before end date"
    };
  }

  // ===== calculate total =====

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

    const isSunday =
      currentDate.getDay() === 0;

    const startOfDay =
      new Date(currentDate);

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const endOfDay =
      new Date(currentDate);

    endOfDay.setHours(
      23,
      59,
      59,
      999
    );

    const holiday =
      await CompanyHoliday.findOne({

        startDate: {
          $lte: endOfDay
        },

        endDate: {
          $gte: startOfDay
        }

      }).lean();

    if (
      !isSunday &&
      !holiday
    ) {

      totalDays++;
    }

    current.setDate(
      current.getDate() + 1
    );
  }

  // ===== validate total =====

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

    // hoàn phép cũ trước

    if (
      leaveRequest.leaveType ===
      "ANNUAL"
    ) {

      employee.leaveBalance +=
        leaveRequest.totalDays;
    }

    // check lại

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

    // trừ phép mới

    employee.leaveBalance -=
      totalDays;

    await employee.save();
  }

  // ===== sick leave =====

  if (
    leaveType === "SICK"
  ) {

    // nếu update mà không upload mới
    // thì giữ file cũ

    if (
      !medicalProof &&
      !leaveRequest.medicalProof
    ) {

      return {
        status: "ERROR",
        message:
          "Medical proof is required for sick leave"
      };
    }
  }

  // ===== update =====

  leaveRequest.employeeId =
    employeeId;

  leaveRequest.employeeCode =
    employee.code;

  leaveRequest.employeeName =
    employee.name;

  leaveRequest.leaveType =
    leaveType;

  leaveRequest.startDate =
    startDate;

  leaveRequest.endDate =
    endDate;

  leaveRequest.totalDays =
    totalDays;

  leaveRequest.reason =
    reason;

  leaveRequest.isPaidLeave =
    isPaidLeave;

  // giữ file cũ nếu không upload mới

  if (
    leaveType === "SICK"
  ) {

    leaveRequest.medicalProof =
      medicalProof ||

      leaveRequest.medicalProof;

  } else {

    leaveRequest.medicalProof =
      null;
  }

  await leaveRequest.save();

  return {

    status: "SUCCESS",

    data: leaveRequest
  };
};

const deleteLeaveRequestService = async (id) => {
  console.log("Deleting leave request with ID:", id);
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
      return {
        status: "ERROR",
        message: "Leave request not found"
      };
    }

    await LeaveRequest.findByIdAndDelete(id);

    return {
      status: "SUCCESS",
      message: "Delete leave request success"
    };
  };

module.exports = {
  createLeaveRequestService,
  getLeaveRequestsService,
  updateLeaveRequestService,
  deleteLeaveRequestService
};