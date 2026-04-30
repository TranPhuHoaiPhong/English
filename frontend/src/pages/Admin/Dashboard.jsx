import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
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
      
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null} // ❌ tắt nút mặc định
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
              key: "/dashboard/settings",
              icon: <SettingOutlined />,
              label: "Settings"
            }
          ]}
        />
      </Sider>

      {/* MAIN */}
      <Layout>
        
        {/* HEADER */}
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          
          {/* nút fold/unfold */}
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, cursor: "pointer" }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          <div>Admin Panel</div>
        </Header>

        {/* CONTENT */}
        <Content style={{ margin: 20 }}>
          <Outlet />
        </Content>

      </Layout>
    </Layout>
  );
}

export default Dashboard;