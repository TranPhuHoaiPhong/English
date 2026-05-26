const Employee = require("../../models/Employee");
const LeaveRequest = require("../../models/LeaveRequest");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../JwtService/JwtService");

const getEmployeeService = async (id) => {

    const employees = await Employee
        .findById(id)
        .populate(
            "department",
            "name"
        );

    if (!employees) {
        return {
            status: "ERROR",
            message: "Employee not found"
        };
    }

    const leaveRequests = await LeaveRequest
        .find({
            employeeId: id
        })
        .sort({
            createdAt: -1
        });

    const totalRequest = leaveRequests.reduce(
        (acc, item) => {
            const status = item.status.toLowerCase();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        },
        {
            pending: 0,
            approved: 0,
            rejected: 0,
            cancelled: 0,
            total: 0
        }
    )
    totalRequest.total = leaveRequests.length;


    return {
        status: "SUCCESS",
        data: {
            employees,
            leaveRequests,
            totalRequest
        }
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
    id: user._id,
    name: user.name,
    code: user.code,
    email: user.email,
    phone: user.phone,
    department: user.department,
    role: user.role,
    leaveBalance: user.leaveBalance,
    status: user.status,
    accessToken,
    refreshToken
  };
};

const changePasswordEmployeesSer = async (id, password) => {
    try {

        const employee = await Employee.findById(id);

        if (!employee) {
            return {
                status: "ERROR",
                message: "Employee not found"
            };
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update password
        employee.password = hashedPassword;

        await employee.save();

        return {
            status: "SUCCESS",
            message: "Change password successfully"
        };

    } catch (error) {

        return {
            status: "ERROR",
            message: error.message
        };

    }
};

module.exports = {
  loginEmployeeService,
  getEmployeeService,
  changePasswordEmployeesSer
};