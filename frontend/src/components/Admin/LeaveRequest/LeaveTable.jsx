import {
  Table,
  Tag,
  Button,
  Space,
  Image,
  Popover
} from "antd";
const API_URL = import.meta.env.VITE_BACKEND_URL;

function LeaveTable({
  filteredData,
  handleOpenDetail,
  handleApprove,
  handleReject
}) {

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

      width: 100,

      fixed: "left",

      render: (_, r) =>

        r.employeeCode
    },

    {
      title: "Name",

      width: 180,

      ellipsis: true,

      render: (_, r) =>

        r.employeeName
    },

    {
      title: "Type",

      width: 100,

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
    width: 180,

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
      title: "Status",
      width: 140,
      render: (_, r) => (

        <Tag>

          {r.status}

        </Tag>
      )
    },

    {
      title: "Action",

      width: 320,

      fixed: "right",

      render: (_, r) => (

        <Space>

          <Button
            type="primary"

            onClick={() =>
              handleApprove(
                r._id
              )
            }
          >
            Approve
          </Button>

          <Button
            danger

            onClick={() =>
              handleReject(
                r._id
              )
            }
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

      style={{
        width: "100%"
      }}
    />
  );
}

export default LeaveTable;