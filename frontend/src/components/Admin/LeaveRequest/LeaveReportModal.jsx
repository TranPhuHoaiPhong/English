import { useMemo, useState } from "react";
import {
Modal,
Table,
Radio,
DatePicker,
Select,
Space,
Typography,
Divider,
Tag
} from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

function LeaveReportModal({
open,
onClose,
leaveRequests
}) {
const [mode, setMode] =
useState("DAY");

const [status, setStatus] =
useState("ALL");

const [selectedDate, setSelectedDate] =
useState(dayjs());

const [selectedMonth, setSelectedMonth] =
useState(dayjs());

const filteredRequests = useMemo(() => {
return leaveRequests.filter(
(item) => {
const matchStatus =
status === "ALL" ||
item.status === status;


    if (mode === "DAY") {
    const matchDate =
        dayjs(
        item.createdAt
        ).isSame(
        selectedDate,
        "day"
        );

    return (
        matchStatus &&
        matchDate
    );
    }

    const matchMonth =
        dayjs(
            item.createdAt
        ).isSame(
            selectedMonth,
            "month"
        );

    return (
      matchStatus &&
      matchMonth
    );
  }
);


}, [
leaveRequests,
status,
mode,
selectedDate,
selectedMonth
]);

const monthlySummary = useMemo(() => {
if (mode !== "MONTH")
return [];


const map = {};

filteredRequests.forEach(
  (item) => {
    const key =
      item.employeeId;

    if (!map[key]) {
      map[key] = {
        employeeCode:
          item.employeeCode,

        employeeName:
          item.employeeName,

        annual: 0,
        sick: 0,
        personal: 0,
        marriage: 0,
        funeral: 0,
        maternity: 0,
        workAccident: 0,

        totalDays: 0,

        details: []
      };
    }

    switch (
      item.leaveType
    ) {
      case "ANNUAL":
        map[key].annual +=
          item.totalDays;
        break;

      case "SICK":
        map[key].sick +=
          item.totalDays;
        break;

      case "PERSONAL":
        map[key].personal +=
          item.totalDays;
        break;

      case "MARRIAGE":
        map[key].marriage +=
          item.totalDays;
        break;

      case "FUNERAL":
        map[key].funeral +=
          item.totalDays;
        break;

      case "MATERNITY":
        map[key].maternity +=
          item.totalDays;
        break;

      case "WORK_ACCIDENT":
        map[key].workAccident +=
          item.totalDays;
        break;
    }

    map[key].totalDays +=
      item.totalDays;

    map[key].details.push(
      `${item.leaveType} (${item.totalDays} day)`
    );
  }
);

return Object.values(map);


}, [
filteredRequests,
mode
]);

const dailyColumns = [
    {
    title: "Code",
    dataIndex:
    "employeeCode"
    },
    {
    title: "Employee",
    dataIndex:
    "employeeName"
    },
    {
    title: "Type",
    dataIndex:
    "leaveType"
    },
    {
    title: "Days",
    dataIndex:
    "totalDays"
    },
    {
    title: "Status",
    dataIndex:
    "status",
    render: (value) => ( <Tag>{value}</Tag>
    )
    },
    {
    title: "From",
    render: (_, row) =>
    dayjs(
    row.startDate
    ).format(
    "DD/MM/YYYY"
    )
    },
    {
    title: "To",
    render: (_, row) =>
    dayjs(
    row.endDate
    ).format(
    "DD/MM/YYYY"
    )
    }
    ];

const monthlyColumns = [
{
title: "Code",
dataIndex:
"employeeCode"
},
{
title: "Employee",
dataIndex:
"employeeName"
},
{
title: "Annual",
dataIndex: "annual"
},
{
title: "Sick",
dataIndex: "sick"
},
{
title: "Personal",
dataIndex:
"personal"
},
{
title: "Marriage",
dataIndex:
"marriage"
},
{
title: "Funeral",
dataIndex:
"funeral"
},
{
title: "Maternity",
dataIndex:
"maternity"
},
{
title:
"Work Accident",
dataIndex:
"workAccident"
},
{
title:
"Total Days",
dataIndex:
"totalDays"
},
{
title:
"Leave Details",
render: (_, row) =>
row.details.join(
", "
)
}
];

return (
  <Modal
    title="Leave Report"
    open={open}
    onCancel={onClose}
    footer={null}
    width={1400}
  >
    <Space style={{ marginBottom: 20 }}>
      <Radio.Group
        value={mode}
        onChange={(e) =>
          setMode(e.target.value)
        }
      >
        <Radio value="DAY">
          Daily Report
        </Radio>

        <Radio value="MONTH">
          Monthly Report
        </Radio>
      </Radio.Group>

      {mode === "DAY" ? (
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
        />
      ) : (
        <DatePicker
          picker="month"
          value={selectedMonth}
          onChange={setSelectedMonth}
        />
      )}

      <Select
        value={status}
        onChange={setStatus}
        style={{ width: 160 }}
      >
        <Select.Option value="ALL">
          All
        </Select.Option>

        <Select.Option value="PENDING">
          Pending
        </Select.Option>

        <Select.Option value="APPROVED">
          Approved
        </Select.Option>

        <Select.Option value="REJECTED">
          Rejected
        </Select.Option>
      </Select>
    </Space>

    <Divider />

    {mode === "DAY" ? (
      <>
        <Title level={5}>
          Leave Requests
        </Title>

        <Table
          rowKey="_id"
          columns={dailyColumns}
          dataSource={filteredRequests}
        />
      </>
    ) : (
      <>
        <Title level={5}>
          Monthly Employee Summary
        </Title>

        <Table
          rowKey="employeeCode"
          columns={monthlyColumns}
          dataSource={monthlySummary}
        />
      </>
    )}
  </Modal>
);
}

export default LeaveReportModal;
