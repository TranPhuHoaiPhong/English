import { List } from "antd";
import {
  UserOutlined,
  LockOutlined,
  LogoutOutlined
} from "@ant-design/icons";

function UserDropdown() {
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
    } else if (item.key === "profile") {
      console.log("Go to profile");
    } else if (item.key === "password") {
      console.log("Change password");
    }
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