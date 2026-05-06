import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message
} from "antd";
import { useState } from "react";
import { departmentsData, employeesData } from "../../services/Admin/employeeData";

const { Option } = Select;

// remove dấu tiếng Việt
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

function EmployeePage() {
  const [departments] = useState(departmentsData);
  const [data, setData] = useState(employeesData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [roleFilter, setRoleFilter] = useState("EMPLOYEE");
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const rolePriority = {
    ADMIN: 1,
    MANAGER: 2,
    EMPLOYEE: 3
  };

  // filter + search
  const filteredData = data
    .filter((item) => {
      const matchRole =
        roleFilter === "ALL" || item.role === roleFilter;

      const keyword = removeVietnameseTones(
        searchText.toLowerCase()
      );

      const matchSearch =
        removeVietnameseTones(item.name.toLowerCase()).includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        (item.phone || "").includes(keyword);

      return matchRole && matchSearch;
    })
    .sort((a, b) => {
      if (roleFilter !== "ALL") return 0;
      return (
        (rolePriority[a.role] || 99) -
        (rolePriority[b.role] || 99)
      );
    });

  const openModal = (record = null) => {
    setEditingEmployee(record);
    setIsModalOpen(true);

    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingEmployee) {
        const newData = data.map((item) =>
          item.key === editingEmployee.key
            ? { ...item, ...values }
            : item
        );
        setData(newData);
        message.success("Cập nhật thành công");
      } else {
        setData([
          ...data,
          { key: Date.now().toString(), ...values }
        ]);
        message.success("Thêm thành công");
      }
      setIsModalOpen(false);
    });
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Đã xóa");
  };

  const columns = [
    { title: "Name", dataIndex: "name", width: "18%" },
    { title: "Code", dataIndex: "code", width: "10%" },
    { title: "Email", dataIndex: "email", width: "22%" },
    { title: "Phone", dataIndex: "phone", width: "12%" },
    {
      title: "Department",
      width: "15%",
      render: (_, record) => {
        const dept = departments.find(
          (d) => d._id === record.departmentId
        );
        return dept?.name || "-";
      }
    },
    { title: "Role", dataIndex: "role", width: "10%" },
    {
      title: "Action",
      width: "13%",
      render: (_, record) => {
        const isAdmin = record.role === "ADMIN";

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
                onConfirm={() => handleDelete(record.key)}
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
    <>
      {/* Toolbar */}
      <Space
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 160, marginRight: 10 }}
          >
            <Option value="ALL">All</Option>
            <Option value="EMPLOYEE">Employee</Option>
            <Option value="MANAGER">Manager</Option>
            <Option value="ADMIN">Admin</Option>
          </Select>

          <Input
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        </div>

        <Button type="primary" onClick={() => openModal()}>
          Add Employee
        </Button>
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        pagination={false}
        tableLayout="fixed"
        scroll={{ y: 700 }}
      />

      {/* Modal */}
      <Modal
        title={editingEmployee ? "Update Employee" : "Add Employee"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true },
              { type: "email", message: "Invalid email" }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Nhập số điện thoại" },
              {
                pattern: /^(0[3|5|7|8|9])[0-9]{8}$/,
                message: "Số điện thoại không hợp lệ"
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="departmentId"
            label="Department"
            rules={[{ required: true }]}
          >
            <Select>
              {departments.map((d) => (
                <Option key={d._id} value={d._id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Option value="EMPLOYEE">EMPLOYEE</Option>
              <Option value="MANAGER">MANAGER</Option>
              <Option value="ADMIN">ADMIN</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EmployeePage;