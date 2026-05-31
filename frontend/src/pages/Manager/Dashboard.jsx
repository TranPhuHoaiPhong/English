import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HistoryOutlined,
  LogoutOutlined
} from "@ant-design/icons";

import {
  Layout,
  Menu,
  Modal
} from "antd";

import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logoutEmployee } from "../../services/Manager/Employee/employeeService";

const { Header, Sider, Content } = Layout;

function DashboardManager() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(true);

  const handleLogout = () => {
    Modal.confirm({
      title: "Logout",
      content: "Are you sure you want to logout?",
      okText: "Logout",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          await logoutEmployee();
          localStorage.removeItem(
            "accessToken"
          );
          sessionStorage.clear();
          navigate("/");
        } catch (error) {
          message.error(
            "Logout failed"
          );
        }
      }
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null} 
        theme="dark"
      >
        <div
          style={{
            color: "#fff",
            padding: 16,
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          {collapsed ? "M" : "MANAGER"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => {
            if (key === "logout") {
              handleLogout();
              return;
            }
            navigate(key);
          }}
          items={[
            {
              key: "/manager/leaverequests",
              icon: <DashboardOutlined />,
              label: "Leave Request"
            }, 
            {
              key: "/manager/leavehistory",
              icon: <HistoryOutlined />,
              label: "History"
            },
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Logout"
            }
          ]}
        />
      </Sider>

      <Layout>
        
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, cursor: "pointer" }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          <div>Manager Panel</div>
        </Header>

        <Content style={{ margin: 20 }}>
          <Outlet />
        </Content>

      </Layout>
    </Layout>
  );
}

export default DashboardManager;