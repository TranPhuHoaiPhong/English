import {
  Table,
  Tag,
  Select,
  Input,
  Space,
  Popover,
  Image
} from "antd";
import { useState } from "react";

// import { leaveRequestsData } from "../../services/Admin/LeaveRequests";

const { Option } = Select;

function LeaveHistoryPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");

  const filteredData = leaveRequestsData.filter((item) => {
    const matchStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    const matchType =
      typeFilter === "ALL" || item.leaveType === typeFilter;

    const matchSearch = item.employee.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchStatus && matchType && matchSearch;
  });

  const typeColor = (type) => {
    switch (type) {
      case "SICK":
        return "red";
      case "ANNUAL":
        return "blue";
      case "UNPAID":
        return "orange";
      default:
        return "purple";
    }
  };

  const statusColor = {
    PENDING: "gold",
    APPROVED: "green",
    REJECTED: "red"
  };

  // 🎯 render proof
  const renderProofStatus = (r) => {
    if (r.leaveType !== "SICK") return "-";

    // ✅ có proof và đã submit → hover xem
    if (r.proofStatus === "SUBMITTED" && r.medicalProof) {
      return (
        <Popover
          content={
            <Image
              src={r.medicalProof}
              width={200}
            />
          }
        >
          <Tag color="blue">Submitted</Tag>
        </Popover>
      );
    }

    // 🟠 đang nộp
    if (r.proofStatus === "SUBMITTING") {
      return <Tag color="orange">Submitting</Tag>;
    }

    // 🟢 đã duyệt proof
    if (r.proofStatus === "APPROVED") {
      return <Tag color="green">Approved</Tag>;
    }

    // 🔴 bị từ chối proof
    if (r.proofStatus === "REJECTED") {
      return <Tag color="red">Rejected</Tag>;
    }

    return <Tag>None</Tag>;
  };

  const columns = [
    {
      title: "Name",
      render: (_, r) => r.employee.name
    },
    {
      title: "Department",
      render: (_, r) => r.employee.department
    },
    {
      title: "Type",
      render: (_, r) => (
        <Tag color={typeColor(r.leaveType)}>
          {r.leaveType}
        </Tag>
      )
    },
    {
      title: "Date",
      render: (_, r) =>
        `${r.startDate} → ${r.endDate}`
    },
    {
      title: "Reason",
      dataIndex: "reason"
    },
    {
      title: "Status",
      render: (_, r) => (
        <Tag color={statusColor[r.status]}>
          {r.status}
        </Tag>
      )
    },
    {
      title: "Proof Status",
      render: (_, r) => renderProofStatus(r)
    }
  ];

  return (
    <>
      {/* FILTER */}
      <Space style={{ marginBottom: 16 }}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
        >
          <Option value="ALL">All Status</Option>
          <Option value="PENDING">Pending</Option>
          <Option value="APPROVED">Approved</Option>
          <Option value="REJECTED">Rejected</Option>
        </Select>

        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 150 }}
        >
          <Option value="ALL">All Type</Option>
          <Option value="SICK">Sick</Option>
          <Option value="ANNUAL">Annual</Option>
          <Option value="UNPAID">Unpaid</Option>
          <Option value="OTHER">Other</Option>
        </Select>

        <Input
          placeholder="Search name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
      </Space>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
      />
    </>
  );
}

export default LeaveHistoryPage;