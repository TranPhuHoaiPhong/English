const express = require("express");
const router = express.Router();

const EmployeeContr = require("../controllers/Admin/EmployeeContr");
const DepartmentContr = require("../controllers/Admin/DepartmentContr");
const HolidayContr = require("../controllers/Admin/Holiday");

const { authMiddleware, authUserMiddleware } = require("../middleware/Middleware");

router.post("/sign-in", EmployeeContr.loginEmployee);

router.post("/employees", authMiddleware, EmployeeContr.createEmployee);
router.get("/employees", authMiddleware, EmployeeContr.getEmployees);
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

module.exports = router;