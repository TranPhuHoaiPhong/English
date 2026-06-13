import {
  Table,
  Tag,
  Select,
  Input,
  Space,
  Popover,
  Image,
  Spin,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Modal,
  Descriptions,
  DatePicker,
  message
} from "antd";

import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { getHistoryLeaveRequest } from "../../services/Admin/HistoryRequest/HistoryRequest";
import LeaveReportModal from "../../components/Admin/LeaveRequest/LeaveReportModal";

const { Option } = Select;

const API_URL = import.meta.env.VITE_BACKEND_URL;

function LeaveHistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [reportOpen, setReportOpen] = useState(false);


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

  const totalRequests =
    data.length;

  const approvedCount =
    data.filter(
      x => x.status === "APPROVED"
    ).length;

  const rejectedCount =
    data.filter(
      x => x.status === "REJECTED"
    ).length;

  const cancelledCount =
    data.filter(
      x => x.status === "CANCELLED"
    ).length;

  const totalLeaveDays =
    data.reduce(
      (sum, item) =>
        sum + item.totalDays,
      0
    );
    

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
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .filter((item) => {
      const matchType =
        typeFilter === "ALL" ||
        item.leaveType === typeFilter;

      const matchStatus =
        statusFilter === "ALL" ||
        item.status === statusFilter;

      const keyword =
        removeVietnameseTones(
          searchText.toLowerCase()
        );

      const matchSearch =
        removeVietnameseTones(
          (item.employeeName || "")
            .toLowerCase()
        ).includes(keyword) ||
        removeVietnameseTones(
          (item.employeeCode || "")
            .toLowerCase()
        ).includes(keyword);

      let matchDate = true;

      if (selectedDate) {
        matchDate =
          dayjs(item.createdAt).format(
            "YYYY-MM-DD"
          ) ===
          selectedDate.format(
            "YYYY-MM-DD"
          );
      }

      return (
        matchType &&
        matchStatus &&
        matchSearch &&
        matchDate
      );
    });

  const exportExcel = () => {

  const exportData =
      filteredData.map(
        item => ({
          Code:
            item.employeeCode,

          Name:
            item.employeeName,

          LeaveType:
            item.leaveType,

          Status:
            item.status,

          Days:
            item.totalDays,

          StartDate:
            new Date(
              item.startDate
            ).toLocaleDateString(),

          EndDate:
            new Date(
              item.endDate
            ).toLocaleDateString(),

          Reason:
            item.reason
        })
      );

    const ws =
      XLSX.utils.json_to_sheet(
        exportData
      );

    const wb =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "LeaveHistory"
    );

    XLSX.writeFile(
      wb,
      "LeaveHistory.xlsx"
    );
  };

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

  // const renderMedicalProof = (r) => {

  //     if (
  //       r.leaveType !==
  //       "SICK"
  //     ) {

  //       return "-";
  //     }

  //     if (
  //       !r.medicalProof
  //     ) {

  //       return (
  //         <Tag color="red">
  //           Missing
  //         </Tag>
  //       );
  //     }

  //     return (

  //       <Popover
  //         content={

  //           <Image
  //             src={
  //               `${API_URL}/uploads/${r.medicalProof?.fileName}`
  //             }
  //             width={220}
  //           />
  //         }
  //       >
  //         <Tag color="green">
  //           View
  //         </Tag>

  //       </Popover>
  //     );
  //   };

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
      ).toLocaleDateString("vi-VN")}
      →
      ${new Date(
        r.endDate
      ).toLocaleDateString("vi-VN")}`
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

  // ...(typeFilter === "SICK" ||
  // typeFilter === "ALL"

  //   ? [

  //       {
  //         title:
  //           "Medical Proof",

  //         width: 180,

  //         render: (_, r) =>
  //           renderMedicalProof(
  //             r
  //           )
  //       }

  //     ]

  //   : []),

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
      ).toLocaleDateString("vi-VN")
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
  },
  {
    title: "Action",
    width: 100,

    render: (_, record) => (

      <Button
        onClick={() => {

          setSelectedRecord(
            record
          );

          setDetailOpen(
            true
          );
        }}
      >
        View
      </Button>
    )
  }
];

  return (
    <Spin spinning={loading} size="large">
      <div>
      
      <Row
        gutter={16}
        justify="center"
        style={{
          marginBottom: 20
        }}
      >

        <Col span={4}>
          <Card>
            <Statistic
              title="Approved"
              value={approvedCount}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card>
            <Statistic
              title="Rejected"
              value={rejectedCount}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card>
            <Statistic
              title="Cancelled"
              value={cancelledCount}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card>
            <Statistic
              title="Leave Days"
              value={totalLeaveDays}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total"
              value={totalRequests}
            />
          </Card>
        </Col>
      </Row>
      
      <Space>
        <div>
          
        </div>
      </Space>

      <Space
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between"
        }}
        wrap
      >

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center"
          }}
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
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center"
          }}
        >
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
          />
          
          <Button
            type="primary"
            onClick={exportExcel}
            style={{
              marginLeft: "auto"
            }}
          >
            Export Excel
          </Button>

          <Button
            type="primary"
            onClick={() =>
              setReportOpen(true)
            }
          >
            Leave Report
          </Button>

          <LeaveReportModal
            open={reportOpen}
            onClose={() =>
              setReportOpen(false)
            }
            leaveRequests={data}
          />
        </div>

      </Space>

      {/* TABLE */}

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: 10
        }}
        scroll={{
          x: "max-content",
          y: 650
        }}
        tableLayout="auto"
      />

      <Modal
        open={detailOpen}
        footer={null}
        onCancel={() =>
          setDetailOpen(false)
        }
        title="Leave Detail"
      >

        {selectedRecord && (

          <Descriptions
            bordered
            column={1}
          >

            <Descriptions.Item
              label="Employee"
            >
              {
                selectedRecord.employeeName
              }
            </Descriptions.Item>

            <Descriptions.Item
              label="Code"
            >
              {
                selectedRecord.employeeCode
              }
            </Descriptions.Item>

            <Descriptions.Item
              label="Leave Type"
            >
              {
                selectedRecord.leaveType
              }
            </Descriptions.Item>

            <Descriptions.Item
              label="Status"
            >
              {
                selectedRecord.status
              }
            </Descriptions.Item>

            <Descriptions.Item
              label="Days"
            >
              {
                selectedRecord.totalDays
              }
            </Descriptions.Item>

            <Descriptions.Item
              label="Reason"
            >
              {
                selectedRecord.reason
              }
            </Descriptions.Item>

            <Descriptions.Item
              label="Created At"
            >
              {new Date(
                selectedRecord.createdAt
              ).toLocaleString()}
            </Descriptions.Item>

          </Descriptions>
        )}

      </Modal>
    </div>
    </Spin>

  );
}

export default LeaveHistoryPage;