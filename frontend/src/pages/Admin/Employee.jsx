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

const { Option } = Select;

// 🔥 Hàm remove dấu tiếng Việt
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const hasEmployees = (managerId) => {
  return data.some(e => e.managerId === managerId);
};

function EmployeePage() {
  const [departments] = useState([
    { _id: "D1", name: "IT" },
    { _id: "D2", name: "HR" }
  ]);

  const [data, setData] = useState([
    {
    key: "1",
    name: "Trưởng phòng IT",
    code: "EMP010",
    email: "manager.it@gmail.com",
    departmentId: "D1",
    role: "MANAGER",
    managerId: null
  },
  {
    key: "2",
    name: "Nguyễn Văn A",
    code: "EMP001",
    email: "vana@gmail.com",
    departmentId: "D1",
    role: "EMPLOYEE",
    managerId: "1"
  },
  {
    key: "3",
    name: "Trần Thị B",
    code: "EMP002",
    email: "thib@gmail.com",
    departmentId: "D1",
    role: "EMPLOYEE",
    managerId: "1"
  },
  {
    key: "4",
    name: "Lê Văn C",
    code: "EMP003",
    email: "vanc@gmail.com",
    departmentId: "D1",
    role: "EMPLOYEE",
    managerId: "1"
  },

  // ===== HR =====
  {
    key: "5",
    name: "Trưởng phòng HR",
    code: "EMP020",
    email: "manager.hr@gmail.com",
    departmentId: "D2",
    role: "MANAGER",
    managerId: null
  },
  {
    key: "6",
    name: "Phạm Thị D",
    code: "EMP004",
    email: "thid@gmail.com",
    departmentId: "D2",
    role: "EMPLOYEE",
    managerId: "5"
  },
  {
    key: "7",
    name: "Hoàng Văn E",
    code: "EMP005",
    email: "vane@gmail.com",
    departmentId: "D2",
    role: "EMPLOYEE",
    managerId: "5"
  },

  // ===== ADMIN =====
  {
    key: "8",
    name: "Admin Tổng",
    code: "EMP999",
    email: "admin@gmail.com",
    departmentId: "D1",
    role: "ADMIN",
    managerId: null
  },

  // ===== thêm random =====
  {
    key: "9",
    name: "Nguyễn Thị Lan",
    code: "EMP006",
    email: "lan@gmail.com",
    departmentId: "D1",
    role: "EMPLOYEE",
    managerId: "1"
  },
  {
    key: "10",
    name: "Trần Văn Nam",
    code: "EMP007",
    email: "nam@gmail.com",
    departmentId: "D2",
    role: "EMPLOYEE",
    managerId: "5"
  },
  {
    key: "11",
    name: "Đỗ Minh Tuấn",
    code: "EMP008",
    email: "tuan@gmail.com",
    departmentId: "D1",
    role: "EMPLOYEE",
    managerId: "1"
  },
  {
    key: "12",
    name: "Phan Quốc Huy",
    code: "EMP009",
    email: "huy@gmail.com",
    departmentId: "D2",
    role: "EMPLOYEE",
    managerId: "5"
  }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [roleFilter, setRoleFilter] = useState("EMPLOYEE");
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

    const rolePriority = {
    MANAGER: 2,
    EMPLOYEE: 3,
    ADMIN: 1
    };

  // 🔥 FILTER + SEARCH KHÔNG DẤU
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
      item.code.toLowerCase().includes(keyword);

    return matchRole && matchSearch;
  })
  .sort((a, b) => {
    // chỉ sort khi ALL
    if (roleFilter !== "ALL") return 0;

    return (
      (rolePriority[a.role] || 99) -
      (rolePriority[b.role] || 99)
    );
  });

  // 👉 modal
  const openModal = (record = null) => {
    setEditingEmployee(record);
    setIsModalOpen(true);

    if (record) {
      form.setFieldsValue(record);
      setSelectedDept(record.departmentId);
    } else {
      form.resetFields();
      setSelectedDept(null);
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

  const managers = data.filter((item) => {
    if (!selectedDept) return item.role === "MANAGER";
    return (
      item.role === "MANAGER" &&
      item.departmentId === selectedDept
    );
  });

  const columns = [
    { title: "Name", dataIndex: "name", width: "18%" },
  { title: "Code", dataIndex: "code", width: "10%" },
  { title: "Email", dataIndex: "email", width: "22%" },
  {
    title: "Department",
    width: "12%",
    render: (_, record) => {
      const dept = departments.find(
        (d) => d._id === record.departmentId
      );
      return dept?.name || "-";
    }
  },
  { title: "Role", dataIndex: "role", width: "10%" },
  {
    title: "Manager",
    width: "15%",
    render: (_, record) => {
      const manager = data.find(
        (m) => m.key === record.managerId
      );
      return manager ? manager.name : "-";
    }
  },
  {
    title: "Action",
    width: "13%",
    render: (_, record) => {
      const hasChild = data.some(
        (e) => e.managerId === record.key
      );

      const isAdmin = record.role === "ADMIN";

      return (
        <Space>
          {!isAdmin && (
            <Button onClick={() => openModal(record)}>
              Edit
            </Button>
          )}

          {!isAdmin && !hasChild && (
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
      {/* 🔥 Toolbar */}
      <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
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

      {/* 📋 Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        pagination={false}
        tableLayout="fixed"
        scroll={{ y: 700 }}
      />

      {/* 🧾 Modal */}
      <Modal
        title={editingEmployee ? "Update Employee" : "Add Employee"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changed) => {
            if (changed.departmentId) {
              setSelectedDept(changed.departmentId);
              form.setFieldsValue({ managerId: null });
            }
          }}
        >
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
              { type: "email", message: "Invalid email address" }
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

          <Form.Item name="managerId" label="Manager">
            <Select allowClear>
              {managers.map((m) => (
                <Option key={m.key} value={m.key}>
                  {m.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EmployeePage;