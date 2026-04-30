import { Table, Tag, Button } from "antd";

function LeavePage() {
  const data = [
    { key: 1, name: "Phong", type: "Annual", status: "pending" }
  ];

  const columns = [
    { title: "Employee", dataIndex: "name" },
    { title: "Type", dataIndex: "type" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "gold" : "green"}>
          {status}
        </Tag>
      )
    },
    {
      title: "Action",
      render: () => (
        <>
          <Button type="primary">Approve</Button>
          <Button danger style={{ marginLeft: 8 }}>Reject</Button>
        </>
      )
    }
  ];

  return <Table columns={columns} dataSource={data} />;
}

export default LeavePage;