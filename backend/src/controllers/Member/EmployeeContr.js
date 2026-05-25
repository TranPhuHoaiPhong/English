const EmployeeService = require("../../services/Member/EmployeeSer");

const getEmployees = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await EmployeeService.getEmployeeService(userId);

    if (result.status === "ERROR") {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "ERROR",
      message: "Server error",
    });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name or email is required"
      });
    }

    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!regexEmail.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email invalid"
      });
    }

    const result = await EmployeeService.loginEmployeeService({ email, password });

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      id: result.id,
      name: result.name,
      code: result.code,
      email: result.email,
      phone: result.phone,
      department: result.department,
      role: result.role,
      leaveBalance: result.leaveBalance,
      status: result.status,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const logoutEmployee = async (req, res) => {
    try {

      res.clearCookie(
        "refreshToken",
        {
          httpOnly: true,
          secure:
            process.env
              .NODE_ENV ===
            "production",
          sameSite: "strict"
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "Logout successful"
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
};

module.exports = {
  loginEmployee,
  getEmployees,
  logoutEmployee
};