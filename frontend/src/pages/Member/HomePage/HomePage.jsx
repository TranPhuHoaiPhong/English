import HeaderComponent from "../../../components/HeaderComponent/HeaderComponent";
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Table,
  Progress,
  Select,
  message,
  Spin
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { getEmployees } from "../../../services/Member/HomePage/dashboardData";
import { requestColumns } from "./tableColumns";
import LeaveRequestModal from "./LeaveRequestModel";
import { useNavigate } from "react-router-dom";
import {
  useState,
  useEffect
} from "react";
import { addLeaveRequest } from "../../../services/Member/LeaveRequest/LeaveRequest";

const { Option } = Select;
 
function HomePage() {

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [dataUser, setDataUser] = useState({});
  const [dataRequest, setDataRequest] = useState([]);
  const [dataTotal, setDataTotal] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDataUser = async () => {
    try {
      const data = await getEmployees();

      setDataUser(data.employees);
      setDataRequest(data.leaveRequests)
      setDataTotal(data.totalRequest)
    } catch (error) {

      message.error(
        "Failed to fetch data. Please try again later."
      );
    }
  }

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        await Promise.all([
          fetchDataUser()
        ]);

      } catch (error) {

        message.error("Failed to load dashboard");

      } finally {

        setLoading(false);

      }
    };

    fetchData();

  }, []);

  const filteredRequests = dataRequest

  const handleAdd = async (payload) => {
      try {
        setLoading(true)
        const result = await addLeaveRequest(payload);
        if (result.status === "ERROR") {
          message.error(result.message);
          return false
        } 
        
         message.success(
            "Created successfully"
          );

          fetchDataUser();

          return true;
        
      } catch {
        message.error("Create failed");
        return false
      }
      finally{
        setLoading(false)
      }
    };

  return (
    <>
      <Spin spinning={loading} size="large">
        <HeaderComponent dataUser={dataUser}/>

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
          <LeaveRequestModal
            open={open}
            setOpen={setOpen}
            employeeId={dataUser._id}
            handleAdd={handleAdd}
          />
        </Row>

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={24}>
            <Card style={{ borderRadius: 12 }}>
              <Statistic
                title="Annual Leave"
                value={dataUser?.leaveBalance || 0}
                suffix="days left"
              />
              <Progress
                percent={
                  ((12 - (dataUser?.leaveBalance || 0)) / 12) * 100
                }
                showInfo={false}
                strokeColor={
                  (dataUser?.leaveBalance || 0) <= 3
                    ? "#ff4d4f"
                    : "#1890ff"
                }
              />
              <div style={{ marginTop: 8 }}>
                Total used: {
                  12 - (dataUser?.leaveBalance || 0)
                } / 12 days
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Pending"
                value={dataTotal.pending}
                valueStyle={{ color: "#faad14" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title="Approved"
                value={dataTotal.approved}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title="Rejected"
                value={dataTotal.rejected}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title="Total"
                value={dataTotal.total}
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
                Leave Requests 
              </span>


            </div>
          }
        >
          <Table
            rowKey="_id"
            columns={requestColumns(fetchDataUser)}
            dataSource={dataRequest}
            pagination={false}
          />
        </Card>

      </div>
      </Spin>
    </>
  );
}

export default HomePage;