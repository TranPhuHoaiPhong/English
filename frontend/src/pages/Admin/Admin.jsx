import { Row, Col, Card, Statistic } from "antd";
import {
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

function AdminDashboard() {
  return (
    <Row gutter={[16, 16]} style={{ margin: 0 }}>
      
      <Col xs={24} sm={12} md={12} lg={6}>
        <Card>
          <Statistic title="Employees" value={120} prefix={<TeamOutlined />} />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={12} lg={6}>
        <Card>
          <Statistic title="Total Requests" value={80} prefix={<CalendarOutlined />} />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={12} lg={6}>
        <Card>
          <Statistic title="Approved" value={50} prefix={<CheckCircleOutlined />} />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={12} lg={6}>
        <Card>
          <Statistic title="Pending" value={20} prefix={<ClockCircleOutlined />} />
        </Card>
      </Col>

    </Row>
  );
}

export default AdminDashboard;