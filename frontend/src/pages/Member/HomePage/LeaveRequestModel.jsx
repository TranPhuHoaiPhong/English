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

        {/* Session */}
        <Form.Item label="Session" name="leave_session">
          <Select defaultValue="full_day">
            <Select.Option value="full_day">Full Day</Select.Option>
            <Select.Option value="morning">Morning</Select.Option>
            <Select.Option value="afternoon">Afternoon</Select.Option>
          </Select>
        </Form.Item>

        {/* Reason */}
        <Form.Item label="Reason" name="reason">
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* 👇 Chỉ hiện khi sick */}
        {leaveType === "sick" && (
            <Form.Item shouldUpdate>
                {({ getFieldValue }) => {
                    const isSick = getFieldValue("leave_type") === "sick";

                    return (
                    <motion.div
                        initial={false}
                        animate={{
                        height: isSick ? "auto" : 0,
                        opacity: isSick ? 1 : 0,
                        marginTop: isSick ? 16 : 0
                        }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                    >
                        <Form.Item
                        label="Medical Proof"
                        name="attachments"
                        rules={
                            isSick
                            ? [{ required: true, message: "Please upload medical proof" }]
                            : []
                        }
                        >
                        <Upload beforeUpload={() => false}>
                            <Button>Upload file</Button>
                        </Upload>
                        </Form.Item>
                    </motion.div>
                    );
                }}
            </Form.Item>
        )}

      </Form>
    </Modal>
  );
}

export default LeaveRequestModal;