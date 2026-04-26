import HeaderComponent from "../../../components/HeaderComponent/HeaderComponent";
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Table,
  Progress,
  Select
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useState } from "react";
import { leaveBalance, requests } from "../../../services/Member/HomePage/dashboardData";
import { requestColumns } from "./tableColumns";
import LeaveRequestModal from "./LeaveRequestModel";

const { Option } = Select;

function HomePage() {
  const [year, setYear] = useState(2026);

  const filteredRequests = requests.filter(r => r.year === year);

  const totalUsed = leaveBalance.reduce((sum, item) => sum + item.used, 0);
  const total = leaveBalance.reduce((sum, item) => sum + item.total, 0);

  const [open, setOpen] = useState(false);

  return (
    <>
      <HeaderComponent />

      <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 20, background: "#fafafa", padding: 12, borderRadius: 8 }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              Leave Management
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              Manage your leave requests and balances
            </div>
          </div>

          <Button 
            type="primary" 
            size="large"
            onClick={() => setOpen(true)}>
            Request Leave
          </Button>
          <LeaveRequestModal open={open} setOpen={setOpen} />
        </Row>

        <Row gutter={16} style={{ marginBottom: 20 }}>
          {leaveBalance.map((item, index) => {
            const percent = (item.used / item.total) * 100;

            return (
              <Col span={24} key={index}>
                <Card style={{ borderRadius: 12 }}>
                  <Statistic
                    title={`${item.type} Leave`}
                    value={item.remaining}
                    suffix="days left"
                  />

                  <Progress
                    percent={percent}
                    showInfo={false}
                    strokeColor={percent > 70 ? "#ff4d4f" : "#1890ff"}
                  />

                  <div style={{ marginTop: 8 }}>
                    Total used: {item.used} / {item.total} days
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Pending"
                value={filteredRequests.filter(r => r.status === "pending").length}
                valueStyle={{ color: "#faad14" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title="Approved"
                value={filteredRequests.filter(r => r.status === "approved").length}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title="Rejected"
                value={filteredRequests.filter(r => r.status === "rejected").length}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title="Total"
                value={filteredRequests.length}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card
          style={{ borderRadius: 12 }}
          title={
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              
              <span style={{ fontWeight: 600 }}>
                Leave Requests ({year})
              </span>

              <Select value={year} onChange={setYear} style={{ width: 120 }}>
                <Select.Option value={2026}>2026</Select.Option>
                <Select.Option value={2025}>2025</Select.Option>
              </Select>

            </div>
          }
        >
          <Table
            columns={requestColumns}
            dataSource={filteredRequests}
            pagination={false}
          />
        </Card>

      </div>
    </>
  );
}

export default HomePage;