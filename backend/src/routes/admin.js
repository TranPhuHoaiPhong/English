const express = require("express");
const router = express.Router();

const EmployeeContr = require("../controllers/EmployeeContr");
const { authMiddleware } = require("../middleware/Middleware");


router.post("/employees", authMiddleware, EmployeeContr.createEmployee);
router.get("/employees", authMiddleware, EmployeeContr.getEmployees);
// router.get("/employees/:id", EmployeeContr.getEmployee);
// router.put("/employees/:id", EmployeeContr.updateEmployee);
// router.delete("/employees/:id", EmployeeContr.deleteEmployee);

router.post("/sign-in", EmployeeContr.loginEmployee);


module.exports = router;