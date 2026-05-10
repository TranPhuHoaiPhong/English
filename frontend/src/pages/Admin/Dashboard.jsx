import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HistoryOutlined
} from "@ant-design/icons";

import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(true);

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
          {collapsed ? "A" : "ADMIN"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: "/dashboard/admin",
              icon: <DashboardOutlined />,
              label: "Dashboard"
            },
            {
              key: "/dashboard/employee",
              icon: <TeamOutlined />,
              label: "Employees"
            },
            {
              key: "/dashboard/leaverequests",
              icon: <CalendarOutlined />,
              label: "Leave Requests"
            },
            {
              key: "/dashboard/leavehistory",
              icon: <HistoryOutlined />,
              label: "History"
            },
            {
              key: "/dashboard/settings",
              icon: <SettingOutlined />,
              label: "Settings"
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

          <div>Admin Panel</div>
        </Header>

        <Content style={{ margin: 20 }}>
          <Outlet />
        </Content>

      </Layout>
    </Layout>
  );
}

export default Dashboard;