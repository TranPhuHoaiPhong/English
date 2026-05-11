const express = require("express");
const router = express.Router();

const EmployeeContr = require("../controllers/Admin/EmployeeContr");
const LeaveContr = require("../controllers/Admin/LeaveContr");
const { authMiddleware, authUserMiddleware } = require("../middleware/Middleware");

router.post("/sign-in", EmployeeContr.loginEmployee);

router.post("/leaverequest", LeaveContr.createLeaveRequest);
router.get("/leaverequests", LeaveContr.getLeaveRequests);
// router.put("/leaverequest/:id", LeaveContr.updateLeaveRequest);
// router.delete("/leaverequest/:id", LeaveContr.deleteLeaveRequest);
// router.post("/sign-in", EmployeeContr.loginEmployee);

module.exports = router;