import {
  Avatar,
  Divider,
  Tag
} from "antd";

function UserDropdown({ dataUser }) {

  return (

    <div style={{ width: 260 }}>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center"
        }}
      >

        <Avatar size={52}>
          {dataUser?.name?.charAt(0)}
        </Avatar>

        <div>

          <div
            style={{
              fontWeight: 600,
              fontSize: 16
            }}
          >
            {dataUser?.name}
          </div>

          <div
            style={{
              color: "#888",
              fontSize: 13
            }}
          >
            {dataUser?.email}
          </div>

        </div>

      </div>

      <Divider />

      <p>
        <strong>Code:</strong>
        {" "}
        {dataUser?.code}
      </p>

      <p>
        <strong>Department:</strong>
        {" "}
        {dataUser?.department?.name}
      </p>

      <p>
        <strong>Phone:</strong>
        {" "}
        {dataUser?.phone}
      </p>

      <p>
        <strong>Leave Balance:</strong>
        {" "}
        {dataUser?.leaveBalance} days
      </p>

      <Tag color="green">
        {dataUser?.status}
      </Tag>

    </div>
  );
}

export default UserDropdown;