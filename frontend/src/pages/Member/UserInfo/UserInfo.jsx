import { List, Modal } from "antd";
import {
  UserOutlined,
  LockOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import {logoutEmployee} from "../../../services/Member/HomePage/dashboardData"
import { message } from "antd";
import { useNavigate } from "react-router-dom";

function UserDropdown({dataUser, setOpenProfile}) {
  const navigate = useNavigate();

  const menu = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Personal Information"
    },
    {
      key: "password",
      icon: <LockOutlined />,
      label: "Change Password"
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout"
    }
  ];

  const handleClick = (item) => {
    if (item.key === "logout") {
      console.log("Logout...");
      handleLogout();
    } else if (item.key === "profile") {
      setOpenProfile(true);
    }else if (item.key === "password") {
      console.log("Change password");
    }
  };

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
    <div style={{ width: 220 }}>
      <List
        dataSource={menu}
        renderItem={(item) => (
          <List.Item
            onClick={() => handleClick(item)}
            style={{
              cursor: "pointer",
              padding: "10px 15px",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            {item.icon}
            {item.label}
          </List.Item>
        )}
      />
    </div>
  );
}

export default UserDropdown;