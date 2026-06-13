const cron = require("node-cron");
const Employee = require("../models/Employee");

// 00:00 ngày 1 tháng 1
cron.schedule("0 0 1 1 *", async () => {
  try {
    console.log("Reset phép năm...");

    const employees = await Employee.find({
      status: "ACTIVE"
    });

    for (const employee of employees) {
      const now = new Date();

      const hireDate = new Date(employee.hireDate);

      const yearsWorked =
        now.getFullYear() - hireDate.getFullYear();

      const seniorityBonus = Math.floor(yearsWorked / 5);

      const hazardousBonus = employee.isHazardousWork ? 2 : 0;

      employee.leaveBalance =
        1 + seniorityBonus + hazardousBonus;

      await employee.save();
    }

    console.log("Reset phép thành công");
  } catch (error) {
    console.error("Reset error:", error);
  }
});