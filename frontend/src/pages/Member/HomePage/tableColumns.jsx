import {
  Tag,
  Image,
  Popover,
  Button,
  Popconfirm,
  message
} from "antd";
import { cancelRequest } from "../../../services/Member/Login/resetPw";

const API_URL =
  import.meta.env.VITE_BACKEND_URL;

export const requestColumns = (fetchDataUser) => [
  {
    title: "Employee",
    dataIndex: "employeeName",
    key: "employeeName",
    render: (text) => text,
  },

  {
    title: "Leave Type",
    dataIndex: "leaveType",
    key: "leaveType",

    render: (text) => text,
  },

  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    render: (date) => {
      if (!date) return "-";
      const d = new Date(date);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleDateString();
    },
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
    render: (date) => {
      if (!date) return "-";
      const d = new Date(date);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleDateString();
    },
  },

  {
    title: "Days",
    dataIndex: "totalDays",
    key: "totalDays",

    render: (value, record) => {

      return value;
    },
  },

  {
    title: "Medical Proof",
    key: "medicalProof",
    width: 130,

    render: (_, r) => {

      if (r.leaveType !== "SICK") {
        return "-";
      }

      if (!r.medicalProof?.fileName) {
        return (
          <Tag color="red">
            Missing
          </Tag>
        );
      }

      return (
        <Popover
          trigger="hover"
          content={
            <Image
              src={`${API_URL}/uploads/${r.medicalProof.fileName}`}
              width={220}
              style={{
                borderRadius: 8,
              }}
            />
          }
        >
          <Tag
            color="green"
            style={{
              cursor: "pointer",
            }}
          >
            View
          </Tag>
        </Popover>
      );
    },
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",

    render: (status, record) => {

      let color = "default";

      if (status === "PENDING") {
        color = "orange";
      }

      if (status === "APPROVED") {
        color = "green";
      }

      if (status === "REJECTED") {
        color = "red";
      }

      if (status === "CANCELLED") {
        color = "gray";
      }

      return (
        <Tag color={color}>
          {status}
        </Tag>
      );
    },
  },
  {
    title: "Created At",

    width: 180,

    render: (_, r) =>

      new Date(
        r.createdAt
      ).toLocaleDateString("en-US")
  },
  {
    title: "Done By",
    dataIndex: "doneBy",
    key: "doneBy",

    render: (doneBy, record) => {

      if (record.status === "PENDING") {

        return (
          <Popconfirm
            title="Cancel Leave Request"
            description="Are you sure you want to cancel this request?"
            okText="Yes"
            cancelText="No"
            onConfirm={async () => {

              const result =
                await cancelRequest(
                  record._id
                );

              if (
                result.status ===
                "SUCCESS"
              ) {

                message.success(
                  result.message
                );

                fetchDataUser();

              } else {

                message.error(
                  result.message
                );
              }
            }}
          >
            <Button
              danger
              size="small"
            >
              Cancel
            </Button>
          </Popconfirm>
        );
      }

      return doneBy?.name ? (
        <Tag color="green">
          {doneBy.name}
        </Tag>
      ) : (
        <Tag color="orange">
          Pending
        </Tag>
      );
    },
  }
];