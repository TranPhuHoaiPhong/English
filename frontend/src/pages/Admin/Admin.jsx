import {
  Row,
  Col,
  Card,
  Statistic,
  message
} from "antd";

import {
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

import { useState, useEffect } from "react";

import DepartmentModal from "../../components/Admin/Department/DepartmentModal";
import { getDepartments } from "../../services/Admin/Department/departmentService";

function AdminDashboard() {

  const [openDepartmentModal, setOpenDepartmentModal] = useState(false);
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      message.error(
        "Failed to fetch departments"
      );
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <>

      <Row
        gutter={[16, 16]}
        style={{ margin: 0 }}
      >

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Employees"
              value={120}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Total Requests"
              value={80}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card
            hoverable
            onClick={() =>
              setOpenDepartmentModal(true)
            }
            style={{
              cursor: "pointer"
            }}
          >
            <Statistic
              title="Department"
              value={3}
              prefix={
                <CheckCircleOutlined />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={20}
              prefix={
                <ClockCircleOutlined />
              }
            />
          </Card>
        </Col>

      </Row>

      <DepartmentModal
        open={openDepartmentModal}
        setOpen={setOpenDepartmentModal}
        // add employees count to each department
        departments={departments}
        fetchDepartments={
          fetchDepartments
        }
      />

    </>
  );
}

export default AdminDashboard;