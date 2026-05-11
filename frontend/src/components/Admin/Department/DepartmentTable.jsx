import {
  Table,
  Button,
  Space,
  Popconfirm
} from "antd";

function DepartmentTable({
  departments,
  openEditModal,
  handleDelete
}) {
  
  const columns = [

    {
      title: "ID",
      dataIndex: "_id",
      width: 230,
      align: "center",
      className: "text-center"
    },

    {
      title: "Department Name",
      dataIndex: "name",
      width: 200,
      align: "center",
      className: "text-center"
    },

    {
      title: "Employees",
      dataIndex: "totalEmployees",
      width: 150,
      align: "center",
      className: "text-center"
    },

    {
      title: "Action",
      align: "center",
      className: "text-center", 
      width: 160,

      render: (_, record) => (

        <Space>

          <Button
            onClick={() =>
              openEditModal(record)
            }
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete department?"
            onConfirm={() =>
              handleDelete(record._id)
            }
          >
            <Button danger>
              Delete
            </Button>
          </Popconfirm>

        </Space>
      )
    }
  ];

  return (

    <Table
      columns={columns}
      dataSource={departments}
      rowKey="_id"
      pagination={{
         pageSize: 5
      }}
      tableLayout="fixed"
    />
  );
}

export default DepartmentTable;