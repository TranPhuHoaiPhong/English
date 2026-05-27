import { Table, Button, Space, Popconfirm, Tag } from "antd";

function EmployeeTable({
  filteredData,
  departments,
  openModal,
  handleDelete
}) {
  const columns = [
    { title: "Name", dataIndex: "name", width: "10%" },
    { title: "Code", dataIndex: "code", width: "10%" },
    { title: "Leave Balance", dataIndex: "leaveBalance", width: "10%" },
    { title: "Email", dataIndex: "email", width: "20%" },
    { title: "Phone", dataIndex: "phone", width: "10%" },

    {
      title: "Department",
      dataIndex: ["department", "name"],
      width: "7%",
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
      title: "Status",
      dataIndex: "status",
      width: "10%",

      render: (status) => {

        const color =
          status === "ACTIVE"
            ? "green"
            : "red";

        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      width: "13%",
      render: (_, record) => {
        const isAdmin =
          record.role === "admin";

        const isActive =
          record.status === "ACTIVE";

        return (
          <Space>

            {!isAdmin && (
              <Button
                onClick={() =>
                  openModal(record)
                }
              >
                Edit
              </Button>
            )}

            {!isAdmin && (
              <Popconfirm
                title={
                  isActive
                    ? "Sure to inactivate?"
                    : "Sure to activate?"
                }
                onConfirm={() =>
                  handleDelete(record._id)
                }
              >
                <Button
                  danger={isActive}
                  type={
                    isActive
                      ? "default"
                      : "primary"
                  }
                >
                  {isActive
                    ? "Inactivate"
                    : "Activate"}
                </Button>
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