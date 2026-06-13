import { Select, Input, Space, Button } from "antd";

const { Option } = Select;

function EmployeeFilter({
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter,
  departments,
  searchText,
  setSearchText,
  openModal
}) {
  return (
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
          <Option value="employee">Employee</Option>
          <Option value="manager">Manager</Option>
          <Option value="admin">Admin</Option>
        </Select>

        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 160, marginRight: 10 }}
        >
          <Option value="ACTIVE">Active</Option>
          <Option value="INACTIVE">Inactive</Option>
          <Option value="ALL">All</Option>
        </Select>

        <Select
          value={departmentFilter}
          onChange={setDepartmentFilter}
          style={{ width: 180, marginRight: 10 }}
        >
          <Option value="ALL">
            All Departments
          </Option>

          {departments.map((department) => (
            <Option
              key={department._id}
              value={department._id}
            >
              {department.name}
            </Option>
          ))}
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
  );
}

export default EmployeeFilter;