const Employee = require(
  "../models/Employee"
);

const updateLeaveBalance =
  async employee => {
    const now = new Date();

    const currentYear =
      now.getFullYear();

    const currentMonth =
      now.getMonth() + 1;

    // reset năm mới
    if (
      employee.leaveBalanceYear <
      currentYear
    ) {
      employee.leaveBalance = 0;

      employee.leaveBalanceYear =
        currentYear;

      employee.leaveBalanceMonth = 0;
    }

    // số tháng chưa cộng
    const diff =
      currentMonth -
      employee.leaveBalanceMonth;

    if (diff > 0) {
      employee.leaveBalance +=
        diff;

      employee.leaveBalanceMonth =
        currentMonth;

      await employee.save();
    }

    return employee;
  };

module.exports =
  updateLeaveBalance;