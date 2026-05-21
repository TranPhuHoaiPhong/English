import { useEffect, useState } from "react";
import { message, Button} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import removeVietnameseTones from "../../utils/removeVietnameseTones";
import LeaveFilter from "../../components/Admin/LeaveRequest/LeaveFilter";
import LeaveTable from "../../components/Admin/LeaveRequest/LeaveTable";
import LeaveRequestModal from "../../components/Admin/LeaveRequest/LeaveRequestModal";
import { getLeaveRequest, addLeaveRequest, updateLeaveRequest, deleteLeaveRequest, ApproveLeaveRequest, RejectLeaveRequest } from "../../services/Admin/LeaveRequest/LeaveRequests";
import { getAllEmployees } from "../../services/Admin/Employee/employeeService";

function LeavePage() {
  const [filter, setFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [employees, setEmployees] = useState([]);

  // ===== fetch =====

  const fetchLeaveRequests = async () => {
    try {
      const result = await getLeaveRequest();
      setData( result.data || [] );
    } catch {
      message.error("Failed to fetch leave requests");
    }
  };

  const fetchEmployees = async () => {
    try {
      const result = await getAllEmployees();
      setEmployees(result || []);
    } catch {
      message.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
    fetchEmployees();
  }, []);

  // ===== filter =====

  const filteredData = data.filter((item) => {
      const matchFilter = filter === "ALL" || item.leaveType === filter;
      const keyword = removeVietnameseTones(searchText.toLowerCase());
      const matchSearch =
        removeVietnameseTones(
          (
            item.employeeName || ""
          ).toLowerCase()
        ).includes(keyword)
        ||
        removeVietnameseTones(
          (
            item.employeeCode || ""
          ).toLowerCase()
        ).includes(keyword);

      return (
        matchFilter &&
        matchSearch
      );
    });

  // ===== open detail =====

  const handleOpenDetail = (record) => {
      setSelectedLeave(record);
      setOpenModal(true);
    };

  // ===== approve =====

  const handleApprove = async (id) => {
      try {
        console.log("Approving leave request:", id);
        await ApproveLeaveRequest(id);

        message.success(
          "Approved successfully"
        );

        fetchLeaveRequests();

      } catch {

        message.error(
          "Approve failed"
        );
      }
    };

  // ===== reject =====

  const handleReject = async (id) => {

      try {

        await RejectLeaveRequest(
          id,
          {
            status:
              "REJECTED"
          }
        );

        message.success(
          "Rejected successfully"
        );

        fetchLeaveRequests();

      } catch {

        message.error(
          "Reject failed"
        );
      }
    };

  // ===== update =====

  const handleUpdate = async (
  id,
  payload
) => {

  try {

    const res =
      await updateLeaveRequest(
        id,
        payload
      );

    message.success(
      res.message ||
      "Updated successfully"
    );

    setOpenModal(false);

    fetchLeaveRequests();

  } catch (error) {

    message.error(
      error.message ||
      "Update failed"
    );
  }
};

  // ===== delete =====

  const handleDelete = async (id) => {

      try {

        await deleteLeaveRequest(id);

        message.success(
          "Deleted successfully"
        );

        setOpenModal(false);

        fetchLeaveRequests();

      } catch {

        message.error(
          "Delete failed"
        );
      }
    };

  // ===== add =====

  const handleAdd = async (payload) => {
      try {
        await addLeaveRequest(payload);
        message.success(
          "Created successfully"
        );
        setOpenModal(false);
        fetchLeaveRequests();
      } catch {
        message.error("Create failed");
      }
    };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: 16
        }}
      >
        <LeaveFilter
          filter={filter}
          setFilter={setFilter}
          searchText={searchText}
          setSearchText={
            setSearchText
          }
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedLeave(null);
            setOpenModal(true);
          }}
        >
          Add Leave Request
        </Button>
      </div>

      <LeaveTable
        filteredData={
          filteredData
        }
        handleOpenDetail={
          handleOpenDetail
        }
        handleApprove={
          handleApprove
        }
        handleReject={
          handleReject
        }
      />

      <LeaveRequestModal
        open={openModal}
        setOpen={setOpenModal}
        leaveRequest={
          selectedLeave
        }
        handleUpdate={
          handleUpdate
        }
        handleDelete={
          handleDelete
        }
        handleAdd={
          handleAdd
        }
        handleApprove={
          handleApprove
        }
        handleReject={
          handleReject
        }
        employees={employees}
      />
    </>
  );
}

export default LeavePage;