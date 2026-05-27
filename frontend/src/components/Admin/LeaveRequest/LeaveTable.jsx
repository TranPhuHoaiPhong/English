import {
  Table,
  Tag,
  Button,
  Space,
  Image,
  Popover,
  Popconfirm,
  Modal,
  Input
} from "antd";

import {
  useState
} from "react";
const API_URL = import.meta.env.VITE_BACKEND_URL;

function LeaveTable({
  filteredData,
  handleOpenDetail,
  handleApprove,
  handleReject
}) {

  const [rejectOpen, setRejectOpen] =
    useState(false);

  const [rejectReason, setRejectReason] =
    useState("");

  const [selectedId, setSelectedId] =
    useState(null);

  // ===== color =====

  const typeColor = (type) => {
      switch (type) {
        case "SICK":
        case "PERSONAL":
        case "MATERNITY":
          return "red";
        default:
          return "blue";
      }
    };

  // ===== base columns =====

  const baseColumns = [

    {
      title: "Code",
      width: 150,
      fixed: "left",
      render: (_, r) =>
        r.employeeCode
    },

    {
      title: "Name",
      width: 200,
      ellipsis: true,
      render: (_, r) =>
        r.employeeName
    },
    {
      title: "Type",
      width: 150,
      render: (_, r) => (
        <Tag
          color={
            typeColor(
              r.leaveType
            )
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

        `${new Date(
          r.startDate
        ).toLocaleDateString()}
         →
         ${new Date(
          r.endDate
        ).toLocaleDateString()}`
    },

    {
      title: "Days",

      dataIndex:
        "totalDays",

      width: 100
    },

    {
      title: "Reason",

      dataIndex:
        "reason",

      width: 250,

      ellipsis: true
    }
  ];

  // ===== medical proof column =====

  const medicalProofColumn = {
    title: "Medical Proof",
    width: 150,

    render: (_, r) => {
      if (
        r.leaveType !== "SICK"
      ) {

      return "-";
    }

      if (
        !r.medicalProof
      ) {

        return (

          <Tag color="red">
            Missing
          </Tag>
        );
      }

      return (

        <Popover
          content={

            <Image
              src={
                `${API_URL}/uploads/${r.medicalProof?.fileName}`
              }
              width={220}
            />
            
          }
        >
          <Tag color="green">
            View
          </Tag>

        </Popover>
      );
    }
  };

  // ===== action columns =====

  const actionColumns = [
    
    {
      title: "Created At",

      width: 180,

      render: (_, r) =>

        new Date(
          r.createdAt
        ).toLocaleDateString("en-US")
    },
    
    {
      title: "Status",
      width: 140,

      render: (_, r) => {

        let color = "default";

        if (r.status === "PENDING") {
          color = "gold";
        }

        if (r.status === "APPROVED") {
          color = "green";
        }

        if (r.status === "REJECTED") {
          color = "red";
        }

        return (
          <Tag color={color}>
            {r.status}
          </Tag>
        );
      }
    },

    {
      title: "Action",

      width: 320,

      fixed: "right",

      render: (_, r) => (

        <Space>

          <Popconfirm
            title="Approve leave request?"
            okText="Approve"
            cancelText="Cancel"
            onConfirm={() =>
              handleApprove(
                r._id,
                r.employeeId
              )
            }
          >
            <Button type="primary">
              Approve
            </Button>
          </Popconfirm>

          <Button
  danger
  onClick={() => {

    setSelectedId(r._id);

    setRejectOpen(true);
  }}
>
  Reject
</Button>

          <Button
            onClick={() =>
              handleOpenDetail(r)
            }
          >
            Detail
          </Button>

        </Space>
      )
    }
  ];

  // ===== chỉ thêm cột medical proof nếu có sick =====

  const hasSick =
    filteredData.some(
      (item) =>
        item.leaveType ===
        "SICK"
    );

  const columns =
    hasSick

      ? [
          ...baseColumns,
          medicalProofColumn,
          ...actionColumns
        ]

      : [
          ...baseColumns,
          ...actionColumns
        ];

  return (
    <>

      <style>
        {`
          .expired-row td {
            background: #fff1f0 !important;
          }
        `}
      </style>

      <Table
        rowKey="_id"

        columns={columns}

        dataSource={
          filteredData
        }

        pagination={false}

        tableLayout="fixed"

        scroll={{
          x: 1600,
          y: 650
        }}

        rowClassName={(record) => {

          const createdAt =
            new Date(record.createdAt);

          const now =
            new Date();

          const diffDays =
            (now - createdAt) /
            (1000 * 60 * 60 * 24);

          if (
            diffDays > 1 &&
            record.status === "PENDING"
          ) {
            return "expired-row";
          }

          return "";
        }}

        style={{
          width: "100%"
        }}
      />

      <Modal
  open={rejectOpen}

  title="Reject Leave Request"

  okText="Reject"

  cancelText="Cancel"

  okButtonProps={{
    danger: true
  }}

  onCancel={() => {

    setRejectOpen(false);

    setRejectReason("");

    setSelectedId(null);
  }}

  onOk={() => {

    handleReject(
      selectedId,
      rejectReason
    );

    setRejectOpen(false);

    setRejectReason("");

    setSelectedId(null);
  }}
>

  <Input.TextArea
    rows={4}

    placeholder="Enter reject reason..."

    value={rejectReason}

    onChange={(e) =>
      setRejectReason(
        e.target.value
      )
    }
  />

</Modal>

    </>
  );
}

export default LeaveTable;