import { FaBell } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { Badge, Popover } from "antd";
import NotificationDropdown from "../../pages/Member/NotificationPage/NotificationPage";
import UserDropdown from "../../pages/Member/UserInfo/UserInfo";

function HeaderComponent() {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#001529",
        color: "#fff",
        padding: "15px 20px"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {/* LEFT */}
        <div style={{ fontSize: 18, fontWeight: "bold" }}>
          Leave Management System
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
          
          {/* 🔔 Notification */}
          <Popover
            content={<NotificationDropdown />}
            title="Notifications"
            trigger="click"
            placement="bottomRight"
            getPopupContainer={(trigger) => trigger.parentNode}
          >
            <Badge count={3}>
              <FaBell style={{ fontSize: 26, cursor: "pointer", color: "#fff" }} />
            </Badge>
          </Popover>

          {/* 👤 Avatar */}
          <Popover
            content={<UserDropdown />}
            trigger="click"
            placement="bottomRight"
            getPopupContainer={(trigger) => trigger.parentNode}
          >
            <IoPersonSharp style={{ fontSize: 28, cursor: "pointer" }} />
          </Popover>

        </div>
      </div>
    </div>
  );
}

export default HeaderComponent;