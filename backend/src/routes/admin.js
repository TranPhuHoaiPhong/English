const express = require("express");
const router = express.Router();

const EmployeeContr = require("../controllers/Admin/EmployeeContr");
const DepartmentContr = require("../controllers/Admin/DepartmentContr");
const HolidayContr = require("../controllers/Admin/Holiday");
const LeaveContr = require("../controllers/Admin/LeaveContr");
const BannerContr = require("../controllers/Admin/BannerContr")

const upload = require("../middleware/upload");

const { authMiddleware, authUserMiddleware } = require("../middleware/Middleware");

router.post("/sign-in", EmployeeContr.loginEmployee);
router.post("/sign-out", authMiddleware, EmployeeContr.logoutEmployee);

router.post("/employees", authMiddleware, EmployeeContr.createEmployee);
router.get("/employees", authMiddleware, EmployeeContr.getEmployees);
router.get("/all-employees", authMiddleware, EmployeeContr.getAllEmployees);
router.put("/employees/:id", authUserMiddleware, EmployeeContr.updateEmployee);
router.delete("/employees/:id", authUserMiddleware, EmployeeContr.deleteEmployee);

router.post("/department", authMiddleware, DepartmentContr.createDepartment);
router.get("/department", authMiddleware, DepartmentContr.getDepartments);
router.put("/department/:id", authMiddleware, DepartmentContr.updateDepartment);
router.delete("/department/:id", authMiddleware, DepartmentContr.deleteDepartment);

router.post("/holiday", authMiddleware, HolidayContr.createHoliday);
router.get("/holiday", authMiddleware, HolidayContr.getAllHolidays);
router.put("/holiday/:id", authMiddleware, HolidayContr.updateHoliday);
router.delete("/holiday/:id", authMiddleware, HolidayContr.deleteHoliday);

router.post("/leaverequest", authMiddleware, upload.single("medicalProof"), LeaveContr.createLeaveRequest);
router.put("/leaverequest/:id", authMiddleware, upload.single("medicalProof"), LeaveContr.updateLeaveRequest);
router.get("/leaverequests", authMiddleware, LeaveContr.getLeaveRequests);
router.delete("/leaverequest/:id", authMiddleware, LeaveContr.deleteLeaveRequest);
router.put("/leaverequest/:id/approve/:employeeId", authMiddleware, LeaveContr.approveLeaveRequest);
router.put("/leaverequest/:id/reject/:employeeId", authMiddleware, LeaveContr.rejectLeaveRequest);
router.get("/history/leaverequests", authMiddleware, LeaveContr.getHistoryLeaveRequests);

router.post("/banner", authMiddleware, upload.single("banner"), BannerContr.createBanner);
router.get("/banner", authMiddleware, BannerContr.getBanner);




module.exports = router;