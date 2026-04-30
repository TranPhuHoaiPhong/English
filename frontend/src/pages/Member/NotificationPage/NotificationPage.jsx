// NotificationDropdown.jsx
import { List, Tag } from "antd";

function NotificationDropdown() {
  const notifications = [
    {
      id: 1,
      title: "Leave Approved",
      description: "Your annual leave (01/05 - 03/05) has been approved",
      status: "approved"
    },
    {
      id: 2,
      title: "Leave Rejected",
      description: "Your request has been rejected",
      status: "rejected"
    },
    {
      id: 3,
      title: "Pending Request",
      description: "Your leave is waiting for approval",
      status: "pending"
    },
    {
      id: 1,
      title: "Leave Approved",
      description: "Your annual leave (01/05 - 03/05) has been approved",
      status: "approved"
    },
    {
      id: 2,
      title: "Leave Rejected",
      description: "Your request has been rejected",
      status: "rejected"
    },
    {
      id: 3,
      title: "Pending Request",
      description: "Your leave is waiting for approval",
      status: "pending"
    },
    {
      id: 1,
      title: "Leave Approved",
      description: "Your annual leave (01/05 - 03/05) has been approved",
      status: "approved"
    },
    {
      id: 2,
      title: "Leave Rejected",
      description: "Your request has been rejected",
      status: "rejected"
    },
    {
      id: 3,
      title: "Pending Request",
      description: "Your leave is waiting for approval",
      status: "pending"
    },
    {
      id: 1,
      title: "Leave Approved",
      description: "Your annual leave (01/05 - 03/05) has been approved",
      status: "approved"
    },
    {
      id: 2,
      title: "Leave Rejected",
      description: "Your request has been rejected",
      status: "rejected"
    },
    {
      id: 3,
      title: "Pending Request",
      description: "Your leave is waiting for approval",
      status: "pending"
    },
  ];

  return (
    <div style={{ width: 320, maxHeight: 400, overflowY: "auto" }}>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item style={{ cursor: "pointer" }}>
            <List.Item.Meta
              title={
                <div style={{ display: "flex", gap: 8 }}>
                  {item.title}
                  {item.status === "approved" && <Tag color="green">Approved</Tag>}
                  {item.status === "rejected" && <Tag color="red">Rejected</Tag>}
                  {item.status === "pending" && <Tag color="gold">Pending</Tag>}
                </div>
              }
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default NotificationDropdown;