const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../services/JwtService/JwtService");

const createEmployeeService = async (data) => {
  const { name, email, department, password, role, phone } = data;

  if (!name || !email || !phone) {
    return {
      status: "ERROR",
      message: "Name, email, and phone are required",
    };
  }

  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!regexEmail.test(email)) {
    return {
      status: "ERROR",
      message: "Email invalid",
    };
  }

  const regexPhone = /^(0|\+84)[0-9]{9}$/;
  if (!regexPhone.test(phone)) {
    return {
      status: "ERROR",
      message: "Phone number invalid",
    };
  }

  const existingEmail = await Employee.findOne({ email });
  if (existingEmail) {
    return {
      status: "ERROR",
      message: "Email already exists",
    };
  }

  const existingPhone = await Employee.findOne({ phone });
  if (existingPhone) {
    return {
      status: "ERROR",
      message: "Phone number already exists",
    };
  }

  const hash = bcrypt.hashSync(password, 10);

  const newEmployee = await Employee.create({
    name,
    email,
    department,
    phone,
    password: hash,
    role: role || "employee"
  });

  return {
    status: "SUCCESS",
    data: newEmployee,
  };
};

const loginEmployeeService = async ({ email, password }) => {
  const user = await Employee.findOne({ email });

  if (!user) {
    return {
      success: false,
      message: "Email des not exist"
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return {
      success: false,
      message: "Password is incorrect"
    };
  }

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
    role: user.role
  });

  return {
    success: true,
    message: "Login successful",
    role: user.role,
    accessToken,
    refreshToken
  };
};

const getEmployeeService = async (data) => {
  const employees = await Employee.find();
  
  return {
    status: "SUCCESS",
    data: employees,
  };
};

module.exports = {
  createEmployeeService,
  loginEmployeeService,
  getEmployeeService
};