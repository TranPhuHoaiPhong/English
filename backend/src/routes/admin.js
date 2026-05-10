const express = require("express");
const router = express.Router();

const EmployeeContr = require("../controllers/EmployeeContr");
const DepartmentContr = require("../controllers/DepartmentContr");

const { authMiddleware, authUserMiddleware } = require("../middleware/Middleware");

router.post("/sign-in", EmployeeContr.loginEmployee);

router.post("/employees", authMiddleware, EmployeeContr.createEmployee);
router.get("/employees", authMiddleware, EmployeeContr.getEmployees);
router.put("/employees/:id", authUserMiddleware, EmployeeContr.updateEmployee);
router.delete("/employees/:id", authUserMiddleware, EmployeeContr.deleteEmployee);

router.post("/department", DepartmentContr.createDepartment);
router.get("/department", DepartmentContr.getDepartments);
router.put("/department/:id", DepartmentContr.updateDepartment);
router.delete("/department/:id", DepartmentContr.deleteDepartment);

module.exports = router;