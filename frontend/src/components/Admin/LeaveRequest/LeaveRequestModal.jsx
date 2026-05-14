import { Modal, Form, Input, DatePicker, Select, Button, Popconfirm, Space, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

function LeaveRequestModal({ open, setOpen, leaveRequest, handleUpdate, handleDelete, handleAdd, employees }) {
  const [form] = Form.useForm();
  const isEdit = !!leaveRequest;

  // ===== set data =====

  useEffect(() => {
    if (leaveRequest) {
      form.setFieldsValue({
        employeeId: leaveRequest?.employeeId?._id,
        leaveType: leaveRequest?.leaveType,
        dates: [
          dayjs(
            leaveRequest
              ?.startDate
          ),
          dayjs(
            leaveRequest
              ?.endDate
          )
        ],
        reason: leaveRequest?.reason,
        medicalProof: leaveRequest?.medicalProof
      });
    } else {
      form.resetFields();
    }
  }, [
    leaveRequest,
    form
  ]);

  // ===== submit =====

  const handleSubmit = async () => {
      const values = await form.validateFields();
      const payload = {
        employeeId: values.employeeId,
        leaveType: values.leaveType,
        startDate:
          values.dates[0]
            .format(
              "YYYY-MM-DD"
            ),
        endDate:
          values.dates[1]
            .format(
              "YYYY-MM-DD"
            ),
        reason: values.reason,
        medicalProof:
          values.leaveType ===
          "SICK"
            ? {
                fileName:
                  values
                    ?.medicalProof
                    ?.file
                    ?.name ||
                  "",
                fileUrl:
                  values
                    ?.medicalProof
                    ?.file
                    ?.thumbUrl ||
                  "",
                uploadedAt:
                  new Date()
              }
            : null
      };

      if (isEdit) {
        handleUpdate(
          leaveRequest._id,
          payload
        );
      } else {
        handleAdd(payload);
      }
    };

  return (
    <Modal
      open={open}
      width={700}
      onCancel={() =>
        setOpen(false)
      }
      onOk={handleSubmit}
      title={
        isEdit
          ? "Leave Request Detail"
          : "Add Leave Request"
      }
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Employee"
          name="employeeId"
          rules={[
            {
              required: true,
              message: "Please select employee"
            }
          ]}
        >
          <Select
            placeholder="Select employee"
            style={{width: "100%"}}
            popupMatchSelectWidth
            options={employees.map((employee) => ({
              value: employee._id,
              label: (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 180px 1fr",
                    gap: 12,
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#1677ff"
                    }}
                  >
                    {employee.code}
                  </div>
                  <div>
                    {employee.name}
                  </div>
                  <div
                    style={{
                      color: "#888"
                    }}
                  >
                    {employee.department?.name ||
                      "No Department"}
                  </div>
                </div>
              )
            }))}
            dropdownRender={(menu) => (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 180px 1fr",
                    gap: 12,
                    padding: "8px 12px",
                    fontWeight: 700,
                    borderBottom: "1px solid #f0f0f0",
                    background: "#fafafa"
                  }}
                >
                  <div>Code</div>
                  <div>Name</div>
                  <div>Department</div>
                </div>
                {menu}
              </div>
            )}
          />
        </Form.Item>
        <Form.Item
          label="Leave Type"
          name="leaveType"
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
              leaveType !==
              "SICK"
            ) {
              return null;
            }

            return (
              <Form.Item
                label=
                  "Medical Proof"
                name=
                  "medicalProof"
              >
                <Upload
                  listType=
                    "picture"
                  beforeUpload=
                    {() => false}
                  maxCount={1}
                >
                  <Button
                    icon={
                      <UploadOutlined />
                    }
                  >
                    Upload
                    Medical Proof
                  </Button>
                </Upload>
              </Form.Item>
            );
          }}
        </Form.Item>
      </Form>
      {
        isEdit && (
          <Space>
            <Popconfirm
              title="Delete request?"
              onConfirm={() =>
                handleDelete(
                  leaveRequest._id
                )
              }
            >
              <Button danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    </Modal>
  );
}

export default LeaveRequestModal;