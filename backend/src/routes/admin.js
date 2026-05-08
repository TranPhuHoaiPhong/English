const express = require("express");
const router = express.Router();

const EmployeeContr = require("../controllers/EmployeeContr");
const { authMiddleware, authUserMiddleware } = require("../middleware/Middleware");

router.post("/sign-in", EmployeeContr.loginEmployee);

router.post("/employees", authMiddleware, EmployeeContr.createEmployee);
router.get("/employees", authMiddleware, EmployeeContr.getEmployees);
router.put("/employees/:id", authUserMiddleware, EmployeeContr.updateEmployee);
router.delete("/employees/:id", authUserMiddleware, EmployeeContr.deleteEmployee);



module.exports = router;