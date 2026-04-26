import { Tag } from "antd";

export const requestColumns = [
  { title: "Start", dataIndex: "start" },
  { title: "End", dataIndex: "end" },
  { title: "Type", dataIndex: "type" },
  {
    title: "Status",
    dataIndex: "status",
    render: (status) => {
      if (status === "pending")
        return <Tag color="gold">Pending</Tag>;
      if (status === "approved")
        return <Tag color="green">Approved</Tag>;
      return <Tag color="red">Rejected</Tag>;
    }
  }
];