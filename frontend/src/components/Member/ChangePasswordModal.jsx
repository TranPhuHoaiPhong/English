import {
  Modal,
  Form,
  Input,
  message
} from "antd";
import { changePassword } from "../../services/Member/ChangePassword/ChangePassword";

function ChangePasswordModal({
  open,
  setOpen
}) {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values =
        await form.validateFields();

      if (
        values.newPassword !==
        values.confirmPassword
      ) {
        return message.error(
          "Confirm password does not match"
        );
      }

      console.log(values.newPassword);

      // CALL API HERE
      await changePassword(values.newPassword)

      

      message.success(
        "Password changed successfully"
      );

      form.resetFields();

      setOpen(false);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={open}
      title="Change Password"
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      onOk={handleSubmit}
    >
      <Form
        layout="vertical"
        form={form}
      >
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            {
              required: true,
              message:
                "Please enter new password"
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message:
                "Please confirm password"
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ChangePasswordModal;