import {
  Tag,
  Image,
  Popover
} from "antd";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const requestColumns = [
  {
    title: "Employee",
    dataIndex: "employeeName",
    key: "employeeName"
  },

  {
    title: "Leave Type",
    dataIndex: "leaveType",
    key: "leaveType"
  },

  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",

    render: (date) =>
      new Date(date).toLocaleDateString()
  },

  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",

    render: (date) =>
      new Date(date).toLocaleDateString()
  },

  {
    title: "Days",
    dataIndex: "totalDays",
    key: "totalDays"
  },

  {
    title: "Medical Proof",
    key: "medicalProof",
    width: 180,

    render: (_, r) => {

      // Không phải nghỉ bệnh
      if (r.leaveType !== "SICK") {
        return "-";
      }

      // Nghỉ bệnh nhưng chưa upload ảnh
      if (!r.medicalProof?.fileName) {

        return (
          <Tag color="red">
            Missing
          </Tag>
        );
      }

      // Có ảnh
      return (
        <Popover
          trigger="hover"
          content={
            <Image
              src={
                `${API_URL}/uploads/${r.medicalProof.fileName}`
              }
              width={220}
              style={{
                borderRadius: 8
              }}
            />
          }
        >
          <Tag
            color="green"
            style={{
              cursor: "pointer"
            }}
          >
            View
          </Tag>
        </Popover>
      );
    }
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",

    render: (status) => {

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
    }
  }
];