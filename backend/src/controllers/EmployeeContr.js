// src/controllers/EmployeeController.js
const EmployeeService = require("../services/EmployeeSer");

const createEmployee = async (req, res) => {
  try {
    const result = await EmployeeService.createEmployeeService(req.body);

    if (result.status === "ERROR") {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Lỗi controller:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi server",
    });
  }
};

module.exports = {
  createEmployee,
};