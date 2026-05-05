// src/services/EmployeeService.js
const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");

const createEmployeeService = async (data) => {
  const { name, email, department, managerId, password } = data;

  if (!name || !email) {
    return {
      status: "ERROR",
      message: "Thiếu name hoặc email",
    };
  }

  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!regexEmail.test(email)) {
    return {
      status: "ERROR",
      message: "Email không hợp lệ",
    };
  }

  // 🔍 Check email trùng
  const existingEmail = await Employee.findOne({ email });
  if (existingEmail) {
    return {
      status: "ERROR",
      message: "Email đã tồn tại",
    };
  }

  const hash = bcrypt.hashSync(password, 10);

  // ✅ Tạo employee
  const newEmployee = await Employee.create({
    name,
    email,
    department,
    managerId,
    password: hash,
  });

  return {
    status: "SUCCESS",
    data: newEmployee,
  };
};

module.exports = {
  createEmployeeService,
};