import {
  Modal,
  Descriptions,
  Tag
} from "antd";

function UserProfileModal({
  open,
  setOpen,
  dataUser
}) {
  return (
    <Modal
      open={open}
      onCancel={() =>
        setOpen(false)
      }
      footer={null}
      title="Personal Information"
      width={700}
    >
      <Descriptions
        bordered
        column={1}
      >
        <Descriptions.Item label="Employee Code">
          {dataUser?.code}
        </Descriptions.Item>

        <Descriptions.Item label="Name">
          {dataUser?.name}
        </Descriptions.Item>

        <Descriptions.Item label="Email">
          {dataUser?.email}
        </Descriptions.Item>

        <Descriptions.Item label="Phone">
          {dataUser?.phone}
        </Descriptions.Item>

        <Descriptions.Item label="Department">
          {
            dataUser?.department
              ?.name
          }
        </Descriptions.Item>

        <Descriptions.Item label="Role">
            {
                dataUser?.role
                ?.charAt(0)
                .toUpperCase() +
                dataUser?.role?.slice(1)
            }
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag
            color={
              dataUser?.status ===
              "ACTIVE"
                ? "green"
                : "red"
            }
          >
            {dataUser?.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Year">
          {
            dataUser?.leaveBalanceYear
          }
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
          {new Date(
            dataUser?.createdAt
          ).toLocaleDateString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

export default UserProfileModal;