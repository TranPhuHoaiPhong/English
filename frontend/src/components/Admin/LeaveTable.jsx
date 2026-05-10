import {
  Table,
  Tag,
  Button,
  Space,
  Popover,
  Image,
  Popconfirm
} from "antd";

function LeaveTable({
  filteredData,
  handleApprove,
  handleReject,
  approveProof,
  rejectProof
}) {

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

    return (
      <Tag color={map[status]}>
        {status}
      </Tag>
    );
  };

  const renderProof = (r) => {

    if (r.leaveType !== "SICK")
      return "-";

    // 📌 có giấy xác nhận
    if (r.medicalProof) {

      return (
        <Popover
          content={
            <Image
              src={r.medicalProof}
              width={200}
            />
          }
        >
          <Tag color="green">
            View
          </Tag>
        </Popover>
      );
    }

    // 📌 đang bổ sung giấy
    if (r.proofStatus === "SUBMITTING") {

      const isLate =
        new Date() >
        new Date(r.proofDueDate);

      return (
        <Tag
          color={
            isLate
              ? "red"
              : "orange"
          }
        >
          {
            isLate
              ? "Overdue"
              : "Submitting"
          }
        </Tag>
      );
    }

    // 📌 chưa có giấy
    return (
      <Tag color="orange">
        Missing
      </Tag>
    );
  };

  // 📌 columns chính
  const baseColumns = [

    {
      title: "Name",
      width: 180,
      ellipsis: true,

      render: (_, r) =>
        r.employee.name
    },

    {
      title: "Department",
      width: 180,
      ellipsis: true,

      render: (_, r) =>
        r.employee.department
    },

    {
      title: "Type",
      width: 120,

      render: (_, r) => (
        <Tag
          color={
            typeColor(r.leaveType)
          }
        >
          {r.leaveType}
        </Tag>
      )
    },

    {
      title: "Date",
      width: 220,
      ellipsis: true,

      render: (_, r) =>
        `${r.startDate} → ${r.endDate}`
    },

    {
      title: "Reason",
      dataIndex: "reason",
      width: 260,
      ellipsis: true
    }
  ];

  const proofColumn = {

    title: "Medical Proof",

    width: 180,

    render: (_, r) =>
      renderProof(r)
  };

  // 📌 action columns
  const actionColumns = [

    {
      title: "Status",

      width: 140,

      render: (_, r) =>
        renderStatus(r.status)
    },

    {
      title: "Action",

      width: 300,

      render: (_, r) => {

        // 📌 pending
        if (r.status === "PENDING") {

          return (
            <Space>
              <Popconfirm
                title="Approve request?"
                onConfirm={() =>
                  handleApprove(r)
                }
              >
                <Button type="primary">
                  Approve     
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Reject request?"
                onConfirm={() =>
                  handleReject(r)
                }
              >
                <Button danger>
                  Reject     
                </Button>
              </Popconfirm>
            </Space>
          );
        }

        // 📌 approve proof
        if (
          r.status === "APPROVED" &&
          r.proofStatus === "SUBMITTED"
        ) {

          return (
            <Space>
              <Popconfirm
                title="Approve proof?"
                onConfirm={() =>
                  approveProof(r)
                }
              >
                <Button>
                  Approve Proof
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Reject proof?"
                onConfirm={() =>
                  rejectProof(r)
                }
              >
                <Button danger>
                  Reject Proof
                </Button>
              </Popconfirm>
            </Space>
          );
        }

        // 📌 giữ layout không nhảy
        return (
          <div
            style={{
              height: 32
            }}
          />
        );
      }
    }
  ];

  // 📌 nếu có sick leave thì thêm cột proof
  const hasSick = filteredData.some(
    (item) =>
      item.leaveType === "SICK"
  );

  const columns = hasSick

    ? [
        ...baseColumns,
        proofColumn,
        ...actionColumns
      ]

    : [
        ...baseColumns,
        ...actionColumns
      ];

  return (
    <div style={{ width: "100%" }}>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"

        tableLayout="fixed"

        pagination={false}

        scroll={{
          x: "max-content",
          y: 700
        }}

        style={{
          width: "100%"
        }}
      />

    </div>
  );
}

export default LeaveTable;