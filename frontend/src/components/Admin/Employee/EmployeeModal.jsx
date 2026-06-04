import {
  Modal,
  Form,
  Input,
  Select
} from "antd";

import { useEffect } from "react";

const { Option } = Select;

function EmployeeModal({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  editingEmployee,
  form,
  departments
}) {

  // 📌 set data khi edit
  useEffect(() => {

    if (editingEmployee) {

      form.setFieldsValue({

        ...editingEmployee,

        // 📌 lấy _id cho Select
        department:
          editingEmployee.department?._id

      });

    }

    else {

      form.resetFields();
    }

  }, [editingEmployee, form]);

  return (

    <Modal
      title={
        editingEmployee
          ? "Update Employee"
          : "Add Employee"
      }

      open={isModalOpen}

      onOk={handleSubmit}

      onCancel={() =>
        setIsModalOpen(false)
      }
    >

      <Form
        form={form}
        layout="vertical"
      >

        <Form.Item
          name="name"
          label="Name"

          rules={[
            {
              required: true,
              message: "Name is required"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"

          rules={[
            {
              required: true,
              message: "Email is required"
            },

            {
              type: "email",
              message: "Invalid email"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"

          rules={[
            {
              required: true,
              message: "Phone is required"
            },

            {
              pattern:
                /^(0[3|5|7|8|9])[0-9]{8}$/,

              message:
                "Invalid phone number"
            }
          ]}
        >
          <Input />
        </Form.Item>

        {/* 📌 Department */}
        <Form.Item
          name="department"
          label="Department"

          rules={[
            {
              required: true,
              message:
                "Department is required"
            }
          ]}
        >

          <Select
            placeholder="Select department"
          >

            {departments.map((d) => (

              <Option
                key={d._id}
                value={d._id}
              >
                {d.name}
              </Option>

            ))}

          </Select>

        </Form.Item>

        {/* 📌 Role */}
        <Form.Item
          name="role"
          label="Role"

          rules={[
            {
              required: true,
              message: "Role is required"
            }
          ]}
        >

          <Select>

            <Option value="employee">
              EMPLOYEE
            </Option>

            <Option value="manager">
              MANAGER
            </Option>

            <Option value="admin">
              ADMIN
            </Option>

          </Select>

        </Form.Item>

        {/* 📌 Password */}
        {/* 📌 Password */}
        {!editingEmployee && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Password is required",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}

      </Form>

    </Modal>
  );
}

export default EmployeeModal;