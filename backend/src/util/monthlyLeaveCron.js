const cron = require("node-cron");
const Employee = require("../models/Employee");

// 00:00 ngày 1 mỗi tháng
cron.schedule("0 0 1 * *", async () => {
  try {
    console.log("Cộng phép tháng...");

    const employees = await Employee.find({
      status: "ACTIVE"
    });

    for (const employee of employees) {
      employee.leaveBalance += 1;
      await employee.save();
    }

    console.log(
      `Đã cộng phép cho ${employees.length} nhân viên`
    );
  } catch (error) {
    console.error("Lỗi cron tháng:", error);
  }
});