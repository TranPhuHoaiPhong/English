const LeaveRequest = require("../../models/LeaveRequest");
const Employee = require("../../models/Employee");
const CompanyHoliday = require("../../models/CompanyHoliday");

const { sendMail } = require("../../util/sendMail");

const getLeaveRequestsService = async (userId) => {
  try {

    // tìm manager hiện tại
    const manager = await Employee.findById(userId);

    if (!manager) {
      return {
        status: "ERROR",
        message: "Manager not found"
      };
    }

    // lấy tất cả employee cùng phòng ban
    const employees = await Employee.find({
      department: manager.department
    }).select("_id");

    // lấy danh sách id nhân viên
    const employeeIds = employees.map(
      item => item._id
    );

    // tìm leave request
    const leaveRequests =
      await LeaveRequest.find({
        employeeId: {
          $in: employeeIds
        },

        status: "PENDING"
      })

      .populate("employeeId")

      .sort({
        createdAt: -1
      });

    return {
      status: "SUCCESS",
      data: leaveRequests
    };

  } catch (error) {
    throw error;
  }
};

const getHistoryLeaveRequestsService = async (managerId) => {

  const leaverequests =
    await LeaveRequest.find({
      status: {
        $in: [
          "APPROVED",
          "REJECTED",
          "CANCELLED"
        ]
      },
      doneBy: managerId
    });

  return {
    status: "SUCCESS",
    data: leaverequests
  };
};

const approveLeaveRequestService = async (
  id,
  managerId
) => {

  try {
    console.log("managerId", managerId)
    const leaveRequest =
      await LeaveRequest.findById(id);

    if (!leaveRequest) {
      return {
        status: "ERROR",
        message:
          "Leave request not found"
      };
    }

    // Không cho duyệt lại
    if (
      leaveRequest.status !==
      "PENDING"
    ) {
      return {
        status: "ERROR",
        message:
          "Request already processed"
      };
    }

    // Tìm employee từ leaveRequest
    const employee =
      await Employee.findById(
        leaveRequest.employeeId
      );

    if (!employee) {
      return {
        status: "ERROR",
        message:
          "Employee not found"
      };
    }

    // Update status
    leaveRequest.status = "APPROVED";
    leaveRequest.doneBy = managerId;

    await leaveRequest.save();

    // Format date
    const startDate =
      new Date(
        leaveRequest.startDate
      ).toLocaleDateString(
        "vi-VN",
        {
          timeZone:
            "Asia/Ho_Chi_Minh",
        }
      );

    const endDate =
      new Date(
        leaveRequest.endDate
      ).toLocaleDateString(
        "vi-VN",
        {
          timeZone:
            "Asia/Ho_Chi_Minh",
        }
      );

    // Gửi mail
    await sendMail({

      to: employee.email,

      subject:
        "Leave Request Approved",

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
              background: #52c41a;
              color: white;
              padding: 20px;
              text-align: center;
            "
          >
            <h1
              style="
                margin: 0;
              "
            >
              Leave Request Approved
            </h1>
          </div>

          <div
            style="
              padding: 24px;
            "
          >

            <p>
              Hello
              <b>
                ${employee.name}
              </b>,
            </p>

            <p>
              Your leave request has been
              <span
                style="
                  color: #52c41a;
                  font-weight: bold;
                "
              >
                APPROVED
              </span>.
            </p>

            <table
              style="
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              "
            >

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  Employee
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${employee.name}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  Leave Type
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${leaveRequest.leaveType}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  Start Date
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${startDate}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  End Date
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${endDate}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  Total Days
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${leaveRequest.totalDays}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  Reason
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${leaveRequest.reason}
                </td>
              </tr>

            </table>

            <p
              style="
                margin-top: 24px;
              "
            >
              Thank you.
            </p>

          </div>

        </div>
      `
    });

    return {
      status: "SUCCESS",
      message:
        "Leave request approved and email sent"
    };

  } catch (error) {

    console.log(error);

    return {
      status: "ERROR",
      message:
        error.message
    };
  }
};

const rejectLeaveRequestService = async (
  id,
  rejectReason,
  managerId
) => {

  try {
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
      return {
        status: "ERROR",
        message:
          "Leave request not found"
      };
    }

    // tìm employee
    const employee =
      await Employee.findById(
        leaveRequest.employeeId
      );

    if (!employee) {
      return {
        status: "ERROR",
        message:
          "Employee not found"
      };
    }

    // hoàn lại phép nếu annual
    if (
      leaveRequest.leaveType ===
      "ANNUAL"
    ) {

      employee.leaveBalance +=
        leaveRequest.totalDays;

      await employee.save();
    }

    // update status
    leaveRequest.status =
      "REJECTED";
    leaveRequest.doneBy =
      managerId;

    await leaveRequest.save();

    // format date
    const startDate =
      new Date(
        leaveRequest.startDate
      ).toLocaleDateString(
        "vi-VN",
        {
          timeZone:
            "Asia/Ho_Chi_Minh",
        }
      );

    const endDate =
      new Date(
        leaveRequest.endDate
      ).toLocaleDateString(
        "vi-VN",
        {
          timeZone:
            "Asia/Ho_Chi_Minh",
        }
      );

    // gửi mail
    await sendMail({

      to: employee.email,

      subject:
        "Leave Request Rejected",

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
              background: #ff4d4f;
              color: white;
              padding: 20px;
              text-align: center;
            "
          >
            <h1
              style="
                margin: 0;
              "
            >
              Leave Request Rejected
            </h1>
          </div>

          <div
            style="
              padding: 24px;
            "
          >

            <p>
              Hello
              <b>
                ${employee.name}
              </b>,
            </p>

            <p>
              Your leave request has been
              <span
                style="
                  color: #ff4d4f;
                  font-weight: bold;
                "
              >
                REJECTED
              </span>.
            </p>

            <table
              style="
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              "
            >

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  Employee
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${employee.name}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  Leave Type
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${leaveRequest.leaveType}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  Start Date
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${startDate}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  End Date
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${endDate}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  Total Days
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${leaveRequest.totalDays}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                    font-weight: bold;
                    background: #fafafa;
                  "
                >
                  Reason
                </td>

                <td
                  style="
                    padding: 12px;
                    border: 1px solid #ddd;
                  "
                >
                  ${rejectReason}
                </td>
              </tr>

            </table>

            <p
              style="
                margin-top: 24px;
                color: #555;
              "
            >
              Please contact HR for more details.
            </p>

          </div>

        </div>
      `
    });

    return {
      status: "SUCCESS",
      message:
        "Leave request rejected and email sent"
    };

  } catch (error) {

    console.log(error);

    return {
      status: "ERROR",
      message:
        error.message
    };
  }
};


module.exports = {
  getLeaveRequestsService,
  approveLeaveRequestService,
  rejectLeaveRequestService,
  getHistoryLeaveRequestsService
};