import { leaveRequestsData } from "../../services/Admin/LeaveRequests";
import { Popconfirm } from "antd";

import {
  Table,
  Tag,
  Button,
  Space,
  Popover,
  Image,
  Select
} from "antd";
import { useState } from "react";

const { Option } = Select;

function LeavePage() {
  const [filter, setFilter] = useState("ALL");
  const [data, setData] = useState(leaveRequestsData);

  const filteredData = data.filter((item) => {
    if (filter === "ALL") return true;
    return item.leaveType === filter;
  });

  const handleApprove = (record) => {
    setData((prev) =>
      prev.map((item) => {
        if (item.key !== record.key) return item;

        if (item.leaveType === "SICK" && !item.medicalProof) {
          return {
            ...item,
            status: "APPROVED",
            proofStatus: "SUBMITTING"
          };
        }

        return { ...item, status: "APPROVED" };
      })
    );
  };

  const handleReject = (record) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === record.key
          ? { ...item, status: "REJECTED" }
          : item
      )
    );
  };

  const approveProof = (record) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === record.key
          ? { ...item, proofStatus: "APPROVED" }
          : item
      )
    );
  };

  const rejectProof = (record) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === record.key
          ? { ...item, proofStatus: "REJECTED" }
          : item
      )
    );
  };

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

  const renderStatus = (status) => {
    const map = {
      PENDING: "gold",
      APPROVED: "green",
      REJECTED: "red"
    };
    return <Tag color={map[status]}>{status}</Tag>;
  };

  const renderProof = (r) => {
    if (r.leaveType !== "SICK") return "-";

    if (r.medicalProof) {
      return (
        <Popover content={<Image src={r.medicalProof} width={200} />}>
          <Tag color="green">View</Tag>
        </Popover>
      );
    }

    if (r.proofStatus === "SUBMITTING") {
      const isLate =
        new Date() > new Date(r.proofDueDate);

      return (
        <Tag color={isLate ? "red" : "orange"}>
          {isLate ? "Overdue" : "Submitting"}
        </Tag>
      );
    }

    return <Tag color="orange">Missing</Tag>;
  };

  const baseColumns = [
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
    }
  ];

  const proofColumn = {
    title: "Medical Proof",
    render: (_, r) => renderProof(r)
  };

  const actionColumns = [
    {
      title: "Status",
      render: (_, r) => renderStatus(r.status)
    },
    {
      title: "Action",
      render: (_, r) => {
        if (r.status === "PENDING") {
          return (
            <Space>
              <Popconfirm
                title="Xác nhận duyệt đơn?"
                onConfirm={() => handleApprove(r)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary">Approve</Button>
              </Popconfirm>

              <Popconfirm
                title="Xác nhận từ chối đơn?"
                onConfirm={() => handleReject(r)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Reject</Button>
              </Popconfirm>
            </Space>
          );
        }

        if (
          r.status === "APPROVED" &&
          r.proofStatus === "SUBMITTED"
        ) {
          return (
            <Space>
              <Popconfirm
                title="Duyệt giấy xác nhận?"
                onConfirm={() => approveProof(r)}
              >
                <Button>Approve Proof</Button>
              </Popconfirm>

              <Popconfirm
                title="Từ chối giấy xác nhận?"
                onConfirm={() => rejectProof(r)}
              >
                <Button danger>Reject Proof</Button>
              </Popconfirm>
            </Space>
          );
        }

        return null;
      }
    }
  ];

  const hasSick = filteredData.some(
    (item) => item.leaveType === "SICK"
  );

  const columns = hasSick
    ? [...baseColumns, proofColumn, ...actionColumns]
    : [...baseColumns, ...actionColumns];

  return (
    <>
      <Select
        value={filter}
        onChange={(value) => setFilter(value)}
        style={{ width: 200, marginBottom: 16 }}
      >
        <Option value="ALL">All</Option>
        <Option value="SICK">Sick</Option>
        <Option value="ANNUAL">Annual</Option>
        <Option value="UNPAID">Unpaid</Option>
        <Option value="OTHER">Other</Option>
      </Select>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
      />
    </>
  );
}

export default LeavePage;