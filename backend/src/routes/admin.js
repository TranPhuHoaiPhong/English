const express = require("express");
const router = express.Router();

const EmployeeContr = require("../controllers/EmployeeContr");

router.post("/employees", EmployeeContr.createEmployee);
// router.get("/employees", EmployeeContr.getEmployees);
// router.get("/employees/:id", EmployeeContr.getEmployee);
// router.put("/employees/:id", EmployeeContr.updateEmployee);
// router.delete("/employees/:id", EmployeeContr.deleteEmployee);


module.exports = router;