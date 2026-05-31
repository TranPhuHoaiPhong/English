import { useEffect, useState } from "react";
import { message, Button, Spin} from "antd";
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
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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

    const fetchData = async () => {

      try {

        setLoading(true);

        await Promise.all([
          fetchEmployees(),
          fetchLeaveRequests()
        ]);

      } catch (error) {

        message.error("Failed to load dashboard");

      } finally {

        setLoading(false);

      }
    };

    fetchData();

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
        setActionLoading(true);
        await ApproveLeaveRequest(id);

        message.success(
          "Approved successfully"
        );

        await fetchLeaveRequests();

      } catch {

        message.error(
          "Approve failed"
        );
      }
      finally{
        setActionLoading(false);
      }
    };

  // ===== reject =====

  const handleReject = async (id, rejectReason) => {
      try {
        setActionLoading(true)
        await RejectLeaveRequest(
          id,
          rejectReason
        );

        message.success(
          "Rejected successfully"
        );

        await fetchLeaveRequests();

      } catch {

        message.error(
          "Reject failed"
        );
      }
      finally {
        setActionLoading(false)
      }
    };

  // ===== update =====

  const handleUpdate = async (
  id,
  payload
) => {

  try {
    setActionLoading(true)
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

    await fetchLeaveRequests();

  } catch (error) {

    message.error(
      error.message ||
      "Update failed"
    );
  }finally{
    setActionLoading(false)
  }
};

  // ===== delete =====

  const handleDelete = async (id) => {

      try {
        setActionLoading(true)
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
      }finally{
        setActionLoading(false)
      }
    };

  // ===== add =====

  const handleAdd = async (payload) => {
      try {
        setActionLoading(true)
        await addLeaveRequest(payload);
        message.success(
          "Created successfully"
        );
        setOpenModal(false);
        fetchLeaveRequests();
      } catch {
        message.error("Create failed");
      }finally{
        setActionLoading(false)
      }
    };

  return (
    <>
      <Spin spinning={loading || actionLoading} size="large">
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
      </Spin>
    </>
  );
}

export default LeavePage;