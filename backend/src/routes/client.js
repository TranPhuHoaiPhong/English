const express = require("express");
const router = express.Router();

const EmployeeMemberContr = require("../controllers/Member/EmployeeContr");
const LeaveContrU = require("../controllers/Member/LeaveContrU");
const { authUserApp } = require("../middleware/Middleware");
const upload = require("../middleware/upload");

router.post("/sign-in", EmployeeMemberContr.loginEmployee);

router.post("/leaverequest", authUserApp, upload.single("medicalProof"), LeaveContrU.createLeaveRequest);

router.get("/home", authUserApp, EmployeeMemberContr.getEmployees);
router.post("/sign-out", authUserApp, EmployeeMemberContr.logoutEmployee);
router.post("/change-password", authUserApp, EmployeeMemberContr.changePasswordEmployees);


module.exports = router;