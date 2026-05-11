import { Table, Button, Space, Popconfirm } from "antd";

function EmployeeTable({
  filteredData,
  departments,
  openModal,
  handleDelete
}) {
  const columns = [
    { title: "Name", dataIndex: "name", width: "15%" },
    { title: "Code", dataIndex: "code", width: "10%" },
    { title: "Leave Balance", dataIndex: "leaveBalance", width: "10%" },
    { title: "Email", dataIndex: "email", width: "20%" },
    { title: "Phone", dataIndex: "phone", width: "10%" },

    {
      title: "Department",
      dataIndex: ["department", "name"],
      width: "12%",
      },

    {
      title: "Role",
      dataIndex: "role",
      width: "10%",
      render: (role) =>
        role.charAt(0).toUpperCase() +
        role.slice(1)
    },

    {
      title: "Action",
      width: "13%",
      render: (_, record) => {
        const isAdmin = record.role === "admin";

        return (
          <Space>
            {!isAdmin && (
              <Button onClick={() => openModal(record)}>
                Edit
              </Button>
            )}

            {!isAdmin && (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(record._id)}
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="key"
      pagination={false}
      tableLayout="fixed"
      scroll={{ y: 700 }}
    />
  );
}

export default EmployeeTable;