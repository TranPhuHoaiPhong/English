import { Select, Input, Space } from "antd";

const { Option } = Select;

function LeaveFilter({
  filter,
  setFilter,
  searchText,
  setSearchText
}) {
  return (
    <Space
      style={{
        marginBottom: 16,
        display: "flex"
      }}
    >
      <Select
        value={filter}
        onChange={(value) => setFilter(value)}
        style={{ width: 200 }}
      >
        <Option value="ALL">All</Option>
        <Option value="SICK">Sick</Option>
        <Option value="ANNUAL">Annual</Option>
        <Option value="UNPAID">Unpaid</Option>
        <Option value="EMERGENCY">Emergency</Option>
      </Select>

      <Input
        placeholder="Search employee..."
        value={searchText}
        onChange={(e) =>
          setSearchText(e.target.value)
        }
        style={{ width: 250 }}
      />
    </Space>
  );
}

export default LeaveFilter;