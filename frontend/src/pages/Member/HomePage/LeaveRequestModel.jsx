import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Upload
} from "antd";

import {
  UploadOutlined
} from "@ant-design/icons";

import { useEffect } from "react";

const { RangePicker } = DatePicker;

function LeaveRequestModal({
  open,
  setOpen,
  employeeId,
  handleAdd
}) {

  const [form] = Form.useForm();

  // ===== set employee id =====

  useEffect(() => {

    if (open) {

      form.setFieldsValue({
        employeeId
      });
    }

  }, [
    open,
    employeeId,
    form
  ]);

  // ===== submit =====

  const handleSubmit = async () => {

    const values =
      await form.validateFields();

    const formData =
      new FormData();

    formData.append(
      "employeeId",
      values.employeeId
    );

    formData.append(
      "leaveType",
      values.leaveType
    );

    formData.append(
      "startDate",
      values.dates[0].format(
        "YYYY-MM-DD"
      )
    );

    formData.append(
      "endDate",
      values.dates[1].format(
        "YYYY-MM-DD"
      )
    );

    formData.append(
      "reason",
      values.reason || ""
    );

    // ===== upload file =====

    if (
      values.leaveType === "SICK" &&
      values.medicalProof?.length > 0
    ) {

      formData.append(
        "medicalProof",
        values.medicalProof[0]
          .originFileObj
      );
    }

    await handleAdd(formData);

    form.resetFields();

    setOpen(false);
  };

  return (

    <Modal
      open={open}
      width={700}
      onCancel={() => {

        form.resetFields();

        setOpen(false);
      }}

      onOk={handleSubmit}

      title="Request Leave"
    >

      <Form
        form={form}
        layout="vertical"
      >

        {/* hidden employee id */}

        <Form.Item
          name="employeeId"
          hidden
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Leave Type"
          name="leaveType"
          rules={[
            {
              required: true,
              message:
                "Please select leave type"
            }
          ]}
        >
          <Select>

            <Select.Option value="ANNUAL">
              ANNUAL
            </Select.Option>

            <Select.Option value="MARRIAGE">
              MARRIAGE
            </Select.Option>

            <Select.Option value="CHILD_MARRIAGE">
              CHILD_MARRIAGE
            </Select.Option>

            <Select.Option value="FUNERAL">
              FUNERAL
            </Select.Option>

            <Select.Option value="MILITARY_EXAM">
              MILITARY_EXAM
            </Select.Option>

            <Select.Option value="WORK_ACCIDENT">
              WORK_ACCIDENT
            </Select.Option>

            <Select.Option value="FOREIGN_VISIT">
              FOREIGN_VISIT
            </Select.Option>

            <Select.Option value="SICK">
              SICK
            </Select.Option>

            <Select.Option value="MATERNITY">
              MATERNITY
            </Select.Option>

            <Select.Option value="PERSONAL">
              PERSONAL
            </Select.Option>

          </Select>
        </Form.Item>

        <Form.Item
          label="Date Range"
          name="dates"
          rules={[
            {
              required: true,
              message:
                "Please select date range"
            }
          ]}
        >
          <RangePicker
            style={{
              width: "100%"
            }}
          />
        </Form.Item>

        <Form.Item
          label="Reason"
          name="reason"
          rules={[
            {
              required: true,
              message:
                "Please enter reason"
            }
          ]}
        >
          <Input.TextArea
            rows={4}
          />
        </Form.Item>

        {/* ===== sick only ===== */}

        <Form.Item
          shouldUpdate
          noStyle
        >
          {() => {

            const leaveType =
              form.getFieldValue(
                "leaveType"
              );

            if (
              leaveType !== "SICK"
            ) {

              return null;
            }

            return (

              <Form.Item
                label="Medical Proof"
                name="medicalProof"
                valuePropName="fileList"
                getValueFromEvent={(e) =>
                  e?.fileList
                }

                rules={[
                  {
                    required: true,
                    message:
                      "Please upload medical proof"
                  }
                ]}
              >

                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  maxCount={1}
                >

                  <Button
                    icon={
                      <UploadOutlined />
                    }
                  >
                    Upload Medical Proof
                  </Button>

                </Upload>

              </Form.Item>
            );
          }}
        </Form.Item>

      </Form>

    </Modal>
  );
}

export default LeaveRequestModal;