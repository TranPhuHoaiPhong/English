const cron = require("node-cron");
const Employee = require("../models/Employee");

cron.schedule(
  "0 0 1 1 *",

  async () => {

    console.log(
      "Reset leave balance..."
    );

    await Employee.updateMany(
      {},

      {
        leaveBalance: 13,
        leaveBalanceYear:
          new Date().getFullYear()
      }
    );
  }
);