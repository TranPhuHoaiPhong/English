const Employee = require("../../models/Employee");
const LeaveRequest = require("../../models/LeaveRequest");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../JwtService/JwtService");
const {sendMail} = require("../../util/sendMail")

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
        .populate(
            "doneBy",
            "name email code"
        )
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

const resetPasswordEmployeesSer = async (gmail) => {
  try {

    const employee = await Employee.findOne({
      email: gmail
    });

    if (!employee) {
      return {
        status: "ERROR",
        message: "Employee not found"
      };
    }

    // tạo mật khẩu ngẫu nhiên 6 số
    const newPassword = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // hash password
    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    // cập nhật mật khẩu
    employee.password = hashedPassword;

    await employee.save();

    // gửi mail
    await sendMail({
      to: employee.email,
      subject: "Reset Password",
      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 700px;
            margin: auto;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            overflow: hidden;
          "
        >

          <div
            style="
              background: #1677ff;
              color: white;
              padding: 20px;
              text-align: center;
            "
          >
            <h1 style="margin:0">
              Password Reset
            </h1>
          </div>

          <div style="padding:24px">

            <p>
              Hello
              <b>${employee.name}</b>,
            </p>

            <p>
              Your password has been reset successfully.
            </p>

            <p>
              Your temporary password is:
            </p>

            <div
              style="
                background:#f5f5f5;
                padding:20px;
                text-align:center;
                font-size:28px;
                font-weight:bold;
                letter-spacing:5px;
                border-radius:8px;
              "
            >
              ${newPassword}
            </div>

            <p
              style="
                margin-top:20px;
                color:red;
              "
            >
              Please login and change your password immediately.
            </p>

            <p>
              Thank you.
            </p>

          </div>

        </div>
      `
    });

    return {
      status: "SUCCESS",
      message:
        "New password has been sent to email"
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
  changePasswordEmployeesSer,
  resetPasswordEmployeesSer
};