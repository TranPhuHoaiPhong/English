import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { RangePicker } = DatePicker;

function LeaveRequestModal({ open, setOpen }) {
  const [form] = Form.useForm();

  // 👇 theo dõi leave_type
  const leaveType = Form.useWatch("leave_type", form);
  const reasonType = Form.useWatch("reason_type", form);

  const handleSubmit = (values) => {
    console.log("Form values:", values);
    setOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Request Leave"
      open={open}
      onCancel={() => setOpen(false)}
      onOk={() => form.submit()}
      centered
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>

        {/* Leave Type */}
        <Form.Item
          label="Leave Type"
          name="leave_type"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select type">
            <Select.Option value="annual">Annual</Select.Option>
            <Select.Option value="sick">Sick</Select.Option>
            <Select.Option value="unpaid">Unpaid</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>

        {/* Date */}
        <Form.Item
          label="Date"
          name="date_range"
          rules={[{ required: true }]}
        >
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Reason */}
        <Form.Item
          label="Reason"
          name="reason_type"
          rules={[{ required: true, message: "Please select a reason" }]}
        >
          <Select placeholder="Select reason">
            <Select.Option value="family">Việc gia đình gấp</Select.Option>
            <Select.Option value="admin">Công việc hành chính</Select.Option>
            <Select.Option value="study">Thi cử / học tập</Select.Option>
            <Select.Option value="event">Hiếu hỉ</Select.Option>
            <Select.Option value="other">Lý do cá nhân khác</Select.Option>
          </Select>
        </Form.Item>

        {/* 👇 chỉ hiện khi chọn "other" */}
        {reasonType === "other" && (
          <Form.Item
            label="Other reason"
            name="reason"
            rules={[
              { required: true, message: "Please enter your reason" },
              { max: 200, message: "Max 200 characters" }
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập lý do cụ thể..."
            />
          </Form.Item>
        )}

        {/* 👇 Chỉ hiện khi sick */}
        {leaveType === "sick" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <Form.Item
              label="Medical Proof (optional)"
              name="attachments"
              // ❌ bỏ required
            >
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>
                  Upload file (optional)
                </Button>
              </Upload>
            </Form.Item>
          </motion.div>
        )}

      </Form>
    </Modal>
  );
}

export default LeaveRequestModal;