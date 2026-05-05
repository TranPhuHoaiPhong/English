// utils/scheduler.js
import cron from "node-cron";
import LeaveRequest from "../models/LeaveRequest.js";

cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  const leaves = await LeaveRequest.find({
    proofStatus: "SUBMITTING",
    proofDueDate: { $lt: now }
  });

  for (const leave of leaves) {
    leave.proofStatus = "REJECTED"; // hoặc OVERDUE
    await leave.save();
  }

  console.log("Checked overdue proofs");
});