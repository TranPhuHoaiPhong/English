import {
  Row,
  Col,
  Card,
  Statistic,
  message,
  Image,
  Upload,
  Button,
  Spin
} from "antd";

import {
  UploadOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

import {
  useNavigate
} from "react-router-dom";

import {
  useState,
  useEffect
} from "react";

import DepartmentModal
from "../../components/Admin/Department/DepartmentModal";

import HolidayModal
from "../../components/Admin/Holiday/HolidayModal";

import {
  getDepartments
}
from "../../services/Admin/Department/departmentService";

import {
  getAllEmployees
}
from "../../services/Admin/Employee/employeeService";

import {
  getLeaveRequest
}
from "../../services/Admin/LeaveRequest/LeaveRequests";

import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday
}
from "../../services/Admin/Holiday/Holiday";
import axios from "axios";
import { getBanner, uploadBanner } from "../../services/Admin/Banner/Banner";

function AdminDashboard() {

  const [
    openDepartmentModal,
    setOpenDepartmentModal
  ] = useState(false);

  const [
    departments,
    setDepartments
  ] = useState([]);

  const [
    openHolidayModal,
    setOpenHolidayModal
  ] = useState(false);

  const [
    holidays,
    setHolidays
  ] = useState([]);

  const [
    employees,
    setEmployees
  ] = useState(0);

  const [
    leaveRequests,
    setLeaveRequests
  ] = useState(0);

  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // ===== upload image =====

  const handleUpload = async (info) => {
    try {
      setLoading(true);
      const file =
        info.file.originFileObj;

      if (!file) return;

      // preview local image
      const localUrl =
        URL.createObjectURL(file);

      setImageUrl(localUrl);

      // call api
      const data = await uploadBanner(file);
      setImageUrl(
        `${API_URL}/uploads/${data.data.banner.fileName}`
      );


      message.success(
        "Image uploaded successfully"
      );

      await fetchBanner()

    } catch (error) {

      console.log(error);

      message.error(
        "Upload failed"
      );
    }
    finally{
        setLoading(false)
    }
  };

  const fetchBanner = async () => {

      try {
        const data = await getBanner();

        const fileName = data.data.banner.fileName;

        setImageUrl(
          `${API_URL}/uploads/${fileName}`
        );
 

      } catch (error) {

        console.log(error);
      }
    };

  // ===== fetch departments =====

  const fetchDepartments = async () => {

    try {

      const data =
        await getDepartments();

      setDepartments(data);

    } catch (error) {

      message.error(
        "Failed to fetch departments"
      );
    }
  };

  // ===== fetch holidays =====

  const fetchHolidays =
    async () => {

    try {

      const holiday =
        await getHolidays();

      setHolidays(holiday);

    } catch (error) {

      message.error(
        "Failed to fetch holidays"
      );
    }
  };

  // ===== fetch employees =====

  const fetchEmployees =
    async () => {

    try {

      const data =
        await getAllEmployees();

      setEmployees(
        data.length
      );

    } catch (error) {

      message.error(
        "Failed to fetch employees"
      );
    }
  };

  // ===== fetch leave requests =====

  const fetchLeaveRequests =
    async () => {

    try {

      const data =
        await getLeaveRequest();

      setLeaveRequests(
        data.data.length
      );

    } catch (error) {

      message.error(
        "Failed to fetch leave requests"
      );
    }
  };

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        await Promise.all([
          fetchDepartments(),
          fetchHolidays(),
          fetchEmployees(),
          fetchLeaveRequests(),
          fetchBanner()
        ]);

      } catch (error) {

        message.error("Failed to load dashboard");

      } finally {

        setLoading(false);

      }
    };

    fetchData();

  }, []);

  return (

    <>

      <Spin spinning={loading} size="large">
          <div
        style={{
          padding: 10
        }}
      >

        {/* STATISTIC CARDS */}

        <Row
          gutter={[20, 20]}
        >

          {/* EMPLOYEES */}

          <Col
            xs={24}
            sm={12}
            md={12}
            lg={6}
          >

            <Card

              hoverable

              onClick={() =>
                navigate(
                  "/dashboard/employee"
                )
              }

              style={{
                borderRadius: 18,
                border:
                  "1px solid #f0f0f0"
              }}
            >

              <Statistic

                title="Employees"

                value={employees}

                prefix={
                  <TeamOutlined />
                }
              />

            </Card>

          </Col>

          {/* REQUESTS */}

          <Col
            xs={24}
            sm={12}
            md={12}
            lg={6}
          >

            <Card

              hoverable

              onClick={() =>
                navigate(
                  "/dashboard/leaverequests"
                )
              }

              style={{
                borderRadius: 18,
                border:
                  "1px solid #f0f0f0"
              }}
            >

              <Statistic

                title="Leave Requests"

                value={
                  leaveRequests
                }

                prefix={
                  <CalendarOutlined />
                }
              />

            </Card>

          </Col>

          {/* DEPARTMENT */}

          <Col
            xs={24}
            sm={12}
            md={12}
            lg={6}
          >

            <Card

              hoverable

              onClick={() =>
                setOpenDepartmentModal(
                  true
                )
              }

              style={{
                borderRadius: 18,
                border:
                  "1px solid #f0f0f0"
              }}
            >

              <Statistic

                title="Departments"

                value={
                  departments.length
                }

                prefix={
                  <CheckCircleOutlined />
                }
              />

            </Card>

          </Col>

          {/* HOLIDAYS */}

          <Col
            xs={24}
            sm={12}
            md={12}
            lg={6}
          >

            <Card

              hoverable

              onClick={() =>
                setOpenHolidayModal(
                  true
                )
              }

              style={{
                borderRadius: 18,
                border:
                  "1px solid #f0f0f0"
              }}
            >

              <Statistic

                title="Holidays"

                value={
                  holidays.length
                }

                prefix={
                  <CalendarOutlined />
                }
              />

            </Card>

          </Col>

        </Row>

        {/* IMAGE SECTION */}

        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card
            style={{
              width: 570,
              borderRadius: 20,
              textAlign: "center",
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                marginBottom: 20,
                color: "#1f2937",
              }}
            >
              Company Banner
            </h2>

            <Image
              src={
                imageUrl
              }
              width={300}
              height={500}
              preview={{
                mask: "View",
              }}
              style={{
                objectFit: "cover",
                borderRadius: 18,
                marginBottom: 20,
              }}
            />

            <div>
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  handleUpload({
                    file: {
                      originFileObj: file
                    }
                  });

                  return false;
                }}
              >
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  size="large"
                  style={{ marginTop: "12px"}}
                >
                  Change Image
                </Button>
              </Upload>
            </div>
          </Card>
        </div>

      </div>

      {/* DEPARTMENT MODAL */}

      <DepartmentModal

        open={
          openDepartmentModal
        }

        setOpen={
          setOpenDepartmentModal
        }

        departments={
          departments
        }

        fetchDepartments={
          fetchDepartments
        }
      />

      {/* HOLIDAY MODAL */}

      <HolidayModal

        open={
          openHolidayModal
        }

        setOpen={
          setOpenHolidayModal
        }

        fetchHolidays={
          fetchHolidays
        }

        holidays={
          holidays
        }

        createHoliday={
          createHoliday
        }

        updateHoliday={
          updateHoliday
        }

        deleteHoliday={
          deleteHoliday
        }
      />

      </Spin>

    </>
  );
}

export default AdminDashboard;