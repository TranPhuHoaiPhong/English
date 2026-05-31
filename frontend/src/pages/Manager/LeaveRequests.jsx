import { useEffect, useState } from "react";
import { message, Button, Spin} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import removeVietnameseTones from "../../utils/removeVietnameseTones";
import LeaveFilter from "../../components/Manager/LeaveRequest/LeaveFilter";
import LeaveTable from "../../components/Manager/LeaveRequest/LeaveTable";
import LeaveRequestModal from "../../components/Manager/LeaveRequest/LeaveRequestModal";

import {getLeaveRequestManager, ApproveLeaveRequest, RejectLeaveRequest} from "../../services/Manager/LeaveRequest/LeaveRequests"

function LeaveManagerPage() {
  const [filter, setFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ===== fetch =====

  const fetchLeaveRequests = async () => {
    try {
      const result = await getLeaveRequestManager();
      setData( result.data || [] );
    } catch {
      message.error("Failed to fetch leave requests");
    }
  };

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        await Promise.all([
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

const filteredData = data
  .filter((item) => {
    const matchFilter =
      filter === "ALL" ||
      item.leaveType === filter;

    const keyword = removeVietnameseTones(
      searchText.toLowerCase()
    );

    const matchSearch =
      removeVietnameseTones(
        (item.employeeName || "").toLowerCase()
      ).includes(keyword) ||
      removeVietnameseTones(
        (item.employeeCode || "").toLowerCase()
      ).includes(keyword);

    return (
      matchFilter &&
      matchSearch
    );
  })
  .sort(
    (a, b) =>
      new Date(a.createdAt) -
      new Date(b.createdAt)
  );

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
      </div>

      <LeaveTable
        filteredData={
          filteredData
        }
        handleApprove={
          handleApprove
        }
        handleReject={
          handleReject
        }
      />
      </Spin>
    </>
  );
}

export default LeaveManagerPage;