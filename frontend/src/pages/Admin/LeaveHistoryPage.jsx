import {
  Table,
  Tag,
  Select,
  Input,
  Space,
  Popover,
  Image,
  Spin
} from "antd";
import { useEffect, useState } from "react";
import { getHistoryLeaveRequest } from "../../services/Admin/HistoryRequest/HistoryRequest";

const { Option } = Select;

const API_URL = import.meta.env.VITE_BACKEND_URL;

function LeaveHistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [
    statusFilter,
    setStatusFilter
  ] = useState("ALL");

  const [
    typeFilter,
    setTypeFilter
  ] = useState("ALL");

  const [
    searchText,
    setSearchText
  ] = useState("");


  const fetchLeaveRequests = async () => {
    try {
      const result = await getHistoryLeaveRequest();
      setData( result.data || [] );
    } catch {
      message.error("Failed to fetch leave requests");
    }
  };

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        await Promise.all([
          fetchLeaveRequests()
        ]);

      } catch (error) {

        message.error("Failed to load dashboard");

      } finally {

        setLoading(false);

      }
    };

    fetchData();

  }, []);

  // ===== remove vietnamese =====

  const removeVietnameseTones = (
    str
  ) => {

    return str
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // ===== filter =====

const filteredData = [...data]
  .sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  )
  .filter((item) => {

    const matchType =
      typeFilter === "ALL" ||
      item.leaveType === typeFilter;

    const matchStatus =
      statusFilter === "ALL" ||
      item.status === statusFilter;

    const keyword = removeVietnameseTones(
      searchText.toLowerCase()
    );

    const matchSearch =
      removeVietnameseTones(
        (item.employeeName || "").toLowerCase()
      ).includes(keyword) ||
      removeVietnameseTones(
        (item.employeeCode || "").toLowerCase()
      ).includes(keyword);

    return matchType && matchStatus && matchSearch;
  });

  // ===== type color =====

  const typeColor = (
    type
  ) => {

    switch (type) {

      case "SICK":
        return "red";

      case "PERSONAL":
        return "orange";

      case "MATERNITY":
        return "purple";

      default:
        return "blue";
    }
  };

  // ===== status color =====

  const statusColor = (
    status
  ) => {

    switch (status) {

      case "PENDING":
        return "gold";

      case "APPROVED":
        return "green";

      case "REJECTED":
        return "red";

      case "CANCELLED":
        return "default";

      default:
        return "blue";
    }
  };

  // ===== medical proof =====

  const renderMedicalProof = (r) => {

      if (
        r.leaveType !==
        "SICK"
      ) {

        return "-";
      }

      if (
        !r.medicalProof
      ) {

        return (
          <Tag color="red">
            Missing
          </Tag>
        );
      }

      return (

        <Popover
          content={

            <Image
              src={
                `${API_URL}/uploads/${r.medicalProof?.fileName}`
              }
              width={220}
            />
          }
        >
          <Tag color="green">
            View
          </Tag>

        </Popover>
      );
    };

  // ===== columns =====

  const columns = [

  {
    title: "Code",
    width: 120,
    render: (_, r) =>
      r.employeeCode
  },

  {
    title: "Name",
    width: 180,
    ellipsis: true,
    render: (_, r) =>
      r.employeeName
  },

  {
    title: "Type",
    width: 130,
    render: (_, r) => (

      <Tag
        color={
          typeColor(
            r.leaveType
          )
        }
      >
        {r.leaveType}
      </Tag>
    )
  },

  {
    title: "Date",
    width: 240,
    render: (_, r) =>

      `${new Date(
        r.startDate
      ).toLocaleDateString()}
       →
       ${new Date(
        r.endDate
      ).toLocaleDateString()}`
  },

  {
    title: "Days",
    dataIndex:
      "totalDays",
    width: 100
  },

  {
    title: "Reason",
    dataIndex:
      "reason",
    width: 250,
    ellipsis: true
  },

  // ===== only show when filter is SICK or ALL =====

  ...(typeFilter === "SICK" ||
  typeFilter === "ALL"

    ? [

        {
          title:
            "Medical Proof",

          width: 180,

          render: (_, r) =>
            renderMedicalProof(
              r
            )
        }

      ]

    : []),

  {
    title: "Status",
    width: 140,
    render: (_, r) => (

      <Tag
        color={
          statusColor(
            r.status
          )
        }
      >
        {r.status}
      </Tag>
    )
  },

  {
    title: "Created At",

    width: 180,

    render: (_, r) =>

      new Date(
        r.createdAt
      ).toLocaleString()
  },
  {
    title: "Done By",
    dataIndex: "doneBy",
    key: "doneBy",

    render: (doneBy, record) => {

      if (record.isGroup) {
        return {
          props: {
            colSpan: 0,
          },
        };
      }

      return doneBy?.name || "-";
    },
  }
];

  return (
    <Spin spinning={loading} size="large">
      <div>

      {/* FILTER */}

      <Space
        style={{
          marginBottom: 16
        }}
        wrap
      >

        <Select
          value={statusFilter}
          onChange={
            setStatusFilter
          }
          style={{
            width: 180
          }}
        >
          <Option value="ALL">
            All Status
          </Option>

          <Option value="APPROVED">
            Approved
          </Option>

          <Option value="REJECTED">
            Rejected
          </Option>

          <Option value="CANCELLED">
            Cancelled
          </Option>

        </Select>

        <Select
          value={typeFilter}
          onChange={
            setTypeFilter
          }
          style={{
            width: 180
          }}
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
          placeholder="Search employee..."
          value={searchText}
          onChange={(e) =>
            setSearchText(
              e.target.value
            )
          }
          style={{
            width: 250
          }}
        />

      </Space>

      {/* TABLE */}

      <Table

        rowKey="_id"

        columns={columns}

        dataSource={
          filteredData
        }

        pagination={{
          pageSize: 10
        }}

        tableLayout="fixed"

        scroll={{
          x: 1500,
          y: 650
        }}
      />

    </div>
    </Spin>
  );
}

export default LeaveHistoryPage;