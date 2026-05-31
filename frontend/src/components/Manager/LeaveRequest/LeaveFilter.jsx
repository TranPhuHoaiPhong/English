import { Select, Input, Space } from "antd";
const { Option } = Select;

function LeaveFilter({filter, setFilter, searchText, setSearchText}) {
  return (

    <Space
      wrap
      style={{
        marginBottom: 16,
        display: "flex",
        width: "100%"
      }}
    >
      <Select
        value={filter}
        onChange={(value) =>
          setFilter(value)
        }
        style={{width: 240}}
      >
        <Option value="ALL">
          All Leave Types
        </Option>

        <Option value="ANNUAL">
          Annual Leave
        </Option>

        <Option value="SICK">
          Sick Leave
        </Option>

        <Option value="MARRIAGE">
          Marriage Leave
        </Option>

        <Option value="CHILD_MARRIAGE">
          Child Marriage Leave
        </Option>

        <Option value="FUNERAL">
          Funeral Leave
        </Option>

        <Option value="MILITARY_EXAM">
          Military Exam Leave
        </Option>

        <Option value="WORK_ACCIDENT">
          Work Accident Leave
        </Option>

        <Option value="FOREIGN_VISIT">
          Foreign Visit Leave
        </Option>

        <Option value="MATERNITY">
          Maternity Leave
        </Option>

        <Option value="PERSONAL">
          Personal Leave
        </Option>

      </Select>

      <Input
        placeholder= "Search employee name..."
        value={searchText}
        onChange={(e) =>
          setSearchText(
            e.target.value
          )
        }
        allowClear
        style={{ width: 300 }}
      />

    </Space>
  );
}

export default LeaveFilter;