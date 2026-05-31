const LeaveRequest = require("../../models/LeaveRequest");
const Employee = require("../../models/Employee");
const CompanyHoliday = require("../../models/CompanyHoliday");
const Rule = require("../../models/Rule")
const DayOff = require("../../models/Dayoff")

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

  const start = new Date(startDate + "T00:00:00");

  const end = new Date(endDate + "T00:00:00");

  const nowDate = new Date();
  nowDate.setHours(0, 0, 0, 0);

  const rule = await Rule.findOne();
  const dayOff = await DayOff.findOne();


  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (start < nowDate) {
    return {
      status: "ERROR",
      message:
        "Start date cannot be earlier than today",
    };
  }

  const totalDayOff =
  (end - start) /
    (1000 * 60 * 60 * 24) + 1;

  if (start > end) {

    return {
      status: "ERROR",
      message:
        "Start date must be before end date"
    };
  }

  // ===== employee =====

  const employee = await Employee.findById(employeeId);

  if (!employee) {
    return {
      status: "ERROR",
      message:
        "Employee not found"
    };
  }

  // ===== check overlap leave request =====

  const existedLeave =
    await LeaveRequest.findOne({

      employeeId,

      // bỏ các đơn bị từ chối
      status: {
        $ne: "REJECTED"
      },

      // kiểm tra khoảng ngày bị đè
      startDate: {
        $lte: end
      },

      endDate: {
        $gte: start
      }

    });

  if (existedLeave) {

    return {

      status: "ERROR",

      message:
        "Leave request dates overlap with another leave request"
    };
  }

  // ===== tính ngày nghỉ =====

  let totalDays = 0;

  const current = new Date(start);

  while (current <= end) {
    const currentDate = new Date(current);
    currentDate.setHours(
      0,
      0,
      0,
      0
    );

    // sunday
    const isSunday = currentDate.getDay() === 0;

    // start of day
    const startOfDay = new Date(currentDate);

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    // end of day
    const endOfDay = new Date(currentDate);

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

  const isPaidLeave = paidLeaveTypes.includes(
      leaveType
    );

  // ===== annual leave =====

  if (leaveType === "ANNUAL") {
    if (employee.leaveBalance < totalDays) {
      return {
        status: "ERROR",
        message: "Not enough leave balance",
      };
    }

    const annualday = rule?.ANNUAL || 0;

    const diffDays =
      (start - nowDate) /
      (1000 * 60 * 60 * 24);

    if (diffDays < annualday) {
      return {
        status: "ERROR",
        message: `Annual leave must be submitted at least ${annualday} days in advance`,
      };
    }

    employee.leaveBalance -= totalDays;
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

  // Child marriage
  if (leaveType === "CHILD_MARRIAGE") {
    const CHILD_MARRIAGE = rule?.CHILD_MARRIAGE || 0;
    const diffDays =
      (start - nowDate) /
      (1000 * 60 * 60 * 24);

    if (diffDays < CHILD_MARRIAGE) {
      return {
        status: "ERROR",
        message:
          `Child marriage leave must be submitted at least ${CHILD_MARRIAGE} days in advance`,
      };
    }
    const maxDayOff = dayOff?.CHILD_MARRIAGE || 0;
    if (totalDayOff > maxDayOff) {
      return {
        status: "ERROR",
        message:
          `Child marriage leave cannot exceed ${maxDayOff} days`,
      };
    }
  }

  // Mariage
  if (leaveType === "MARRIAGE") {
    const MARRIAGE = rule?.MARRIAGE || 0;
    const diffDays =
      (start - nowDate) /
      (1000 * 60 * 60 * 24);

    if (diffDays < MARRIAGE) {
      return {
        status: "ERROR",
        message:
          `Marriage leave must be submitted at least ${MARRIAGE} days in advance`,
      };
    }
    const maxDayOff = dayOff?.MARRIAGE || 0;
    if (totalDayOff > maxDayOff) {
      return {
        status: "ERROR",
        message:
          `Child marriage leave cannot exceed ${maxDayOff} days`,
      };
    }
  }

  // MILITARY_EXAM
  if (leaveType === "MILITARY_EXAM") {
    const MILITARY_EXAM = rule?.MILITARY_EXAM || 0;
    const diffDays =
      (start - nowDate) /
      (1000 * 60 * 60 * 24);

    if (diffDays < MILITARY_EXAM) {
      return {
        status: "ERROR",
        message:
          `Military exam leave must be submitted at least ${MILITARY_EXAM} days in advance`,
      };
    }
    const maxDayOff = dayOff?.MILITARY_EXAM || 0;
    if (totalDayOff > maxDayOff) {
      return {
        status: "ERROR",
        message:
          `Child marriage leave cannot exceed ${maxDayOff} days`,
      };
    }
  }

  if (leaveType === "FUNERAL") {
    const FUNERAL = rule?.FUNERAL || 0;

    const diffDays =
      (start - nowDate) /
      (1000 * 60 * 60 * 24);

    if (diffDays < FUNERAL) {
      return {
        status: "ERROR",
        message:
          `Funeral leave must be submitted at least ${FUNERAL} days in advance`,
      };
    }
    const maxDayOff = dayOff?.FUNERAL || 0;
    if (totalDayOff > maxDayOff) {
      return {
        status: "ERROR",
        message:
          `Child marriage leave cannot exceed ${maxDayOff} days`,
      };
    }
  }

  if (leaveType === "WORK_ACCIDENT") {
    const WORK_ACCIDENT =
      rule?.WORK_ACCIDENT || 0;

    const diffDays =
      (start - nowDate) /
      (1000 * 60 * 60 * 24);

    if (diffDays < WORK_ACCIDENT) {
      return {
        status: "ERROR",
        message:
          `Work accident leave must be submitted at least ${WORK_ACCIDENT} days in advance`,
      };
    }
  }

  if (leaveType === "FOREIGN_VISIT") {
    const FOREIGN_VISIT =
      rule?.FOREIGN_VISIT || 0;

    const diffDays =
      (start - nowDate) /
      (1000 * 60 * 60 * 24);

    if (diffDays < FOREIGN_VISIT) {
      return {
        status: "ERROR",
        message:
          `Foreign visit leave must be submitted at least ${FOREIGN_VISIT} days in advance`,
      };
    }
    const maxDayOff = dayOff?.FOREIGN_VISIT || 0;
    if (totalDayOff > maxDayOff) {
      return {
        status: "ERROR",
        message:
          `Child marriage leave cannot exceed ${maxDayOff} days`,
      };
    }
  }

  if (leaveType === "SICK") {
    const SICK = rule?.SICK || 0;

    const diffDays =
      (start - nowDate) /
      (1000 * 60 * 60 * 24);

    if (diffDays < SICK) {
      return {
        status: "ERROR",
        message:
          `Sick leave must be submitted at least ${SICK} days in advance`,
      };
    }
  }

  if (leaveType === "MATERNITY") {
    const MATERNITY =
      rule?.MATERNITY || 0;

    const diffDays =
      (start - nowDate) /
      (1000 * 60 * 60 * 24);

    if (diffDays < MATERNITY) {
      return {
        status: "ERROR",
        message:
          `Maternity leave must be submitted at least ${MATERNITY} days in advance`,
      };
    }
  }

  if (leaveType === "PERSONAL") {
    const PERSONAL =
      rule?.PERSONAL || 0;

    const diffDays =
      (start - nowDate) /
      (1000 * 60 * 60 * 24);

    if (diffDays < PERSONAL) {
      return {
        status: "ERROR",
        message:
          `Personal leave must be submitted at least ${PERSONAL} days in advance`,
      };
    }
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