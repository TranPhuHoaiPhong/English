import {
  Table,
  Tag,
  Select,
  Input,
  Space
} from "antd";
import { useState } from "react";

import { leaveRequestsData } from "./leaveData";

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
      render: (_, r) => {
        if (r.leaveType !== "SICK") return "-";
        return r.proofStatus || "None";
      }
    }
  ];

  return (
    <>
      <h2>Leave History</h2>
    </>
  );
}

export default LeaveHistoryPage;