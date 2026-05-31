const express = require("express");
const router = express.Router();

const LeaveContr = require("../controllers/Manager/LeaveManagerContr");
const EmployeeContr = require("../controllers/Manager/EmployeeContr")

const { managerMiddleware } = require("../middleware/Middleware");

router.get("/leaverequests", managerMiddleware, LeaveContr.getLeaveRequests);
router.put("/leaverequest/:id/approve", managerMiddleware, LeaveContr.approveLeaveRequest);
router.put("/leaverequest/:id/reject", managerMiddleware, LeaveContr.rejectLeaveRequest);
router.get("/history/leaverequests", managerMiddleware, LeaveContr.getHistoryLeaveRequests);
router.post("/sign-out", managerMiddleware, EmployeeContr.logoutEmployee);



module.exports = router;