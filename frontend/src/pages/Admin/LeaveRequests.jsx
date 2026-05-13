// pages/Admin/LeavePage.jsx

import {
  useEffect,
  useState
} from "react";

import {
  message,
  Button
} from "antd";

import {
  PlusOutlined
} from "@ant-design/icons";

import removeVietnameseTones
from "../../utils/removeVietnameseTones";

import LeaveFilter
from "../../components/Admin/LeaveRequest/LeaveFilter";

import LeaveTable
from "../../components/Admin/LeaveRequest/LeaveTable";

import LeaveRequestModal
from "../../components/Admin/LeaveRequest/LeaveRequestModal";

import {

  getLeaveRequest,

  addLeaveRequest,

  updateLeaveRequest,

  deleteLeaveRequest

} from "../../services/Admin/LeaveRequest/LeaveRequests";

function LeavePage() {

  const [filter, setFilter] =
    useState("ALL");

  const [searchText, setSearchText] =
    useState("");

  const [data, setData] =
    useState([]);

  const [openModal, setOpenModal] =
    useState(false);

  const [selectedLeave, setSelectedLeave] =
    useState(null);

  // ===== fetch =====

  const fetchLeaveRequests =
    async () => {

      try {

        const result =
          await getLeaveRequest();

        setData(
          result.data || []
        );

      } catch {

        message.error(
          "Failed to fetch leave requests"
        );
      }
    };

  useEffect(() => {

    fetchLeaveRequests();

  }, []);

  // ===== filter =====

  const filteredData =
    data.filter((item) => {

      const matchFilter =

        filter === "ALL" ||

        item.leaveType === filter;

      const keyword =
        removeVietnameseTones(
          searchText.toLowerCase()
        );

      const matchSearch =
        removeVietnameseTones(
          item.employeeId?.name
            ?.toLowerCase() || ""
        ).includes(keyword);

      return (
        matchFilter &&
        matchSearch
      );
    });

  // ===== open detail =====

  const handleOpenDetail =
    (record) => {

      setSelectedLeave(record);

      setOpenModal(true);
    };

  // ===== approve =====

  const handleApprove =
    async (id) => {

      try {

        await updateLeaveRequest(
          id,
          {
            status:
              "APPROVED"
          }
        );

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

  const handleReject =
    async (id) => {

      try {

        await updateLeaveRequest(
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

  const handleUpdate =
    async (id, payload) => {

      try {

        await updateLeaveRequest(
          id,
          payload
        );

        message.success(
          "Updated successfully"
        );

        setOpenModal(false);

        fetchLeaveRequests();

      } catch {

        message.error(
          "Update failed"
        );
      }
    };

  // ===== delete =====

  const handleDelete =
    async (id) => {

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

  const handleAdd =
    async (payload) => {

      try {

        await addLeaveRequest(
          payload
        );

        message.success(
          "Created successfully"
        );

        setOpenModal(false);

        fetchLeaveRequests();

      } catch {

        message.error(
          "Create failed"
        );
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
      />

    </>
  );
}

export default LeavePage;