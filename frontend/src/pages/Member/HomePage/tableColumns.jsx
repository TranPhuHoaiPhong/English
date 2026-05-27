import {
  Tag,
  Image,
  Popover,
} from "antd";

const API_URL =
  import.meta.env.VITE_BACKEND_URL;

export const requestColumns = [
  {
    title: "Employee",
    dataIndex: "employeeName",
    key: "employeeName",

    render: (_, record) => {

      // row tháng
      if (record.isGroup) {
        return {
          children: (
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                padding: "6px 0",
              }}
            >
              {record.title}
            </div>
          ),

          props: {
            colSpan: 7,
          },
        };
      }

      return record.employeeName;
    },
  },

  {
    title: "Leave Type",
    dataIndex: "leaveType",
    key: "leaveType",

    render: (value, record) => {

      if (record.isGroup) {
        return {
          props: {
            colSpan: 0,
          },
        };
      }

      return value;
    },
  },

  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",

    render: (date, record) => {

      if (record.isGroup) {
        return {
          props: {
            colSpan: 0,
          },
        };
      }

      return new Date(
        date
      ).toLocaleDateString();
    },
  },

  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",

    render: (date, record) => {

      if (record.isGroup) {
        return {
          props: {
            colSpan: 0,
          },
        };
      }

      return new Date(
        date
      ).toLocaleDateString();
    },
  },

  {
    title: "Days",
    dataIndex: "totalDays",
    key: "totalDays",

    render: (value, record) => {

      if (record.isGroup) {
        return {
          props: {
            colSpan: 0,
          },
        };
      }

      return value;
    },
  },

  {
    title: "Medical Proof",
    key: "medicalProof",
    width: 180,

    render: (_, r) => {

      if (r.isGroup) {
        return {
          props: {
            colSpan: 0,
          },
        };
      }

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

      if (record.isGroup) {
        return {
          props: {
            colSpan: 0,
          },
        };
      }

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
];