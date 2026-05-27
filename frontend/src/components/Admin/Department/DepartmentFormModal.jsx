import {
  Modal,
  Form,
  Input,
  message
} from "antd";
import { useEffect } from "react";

import { createDepartment, updateDepartment } from
"../../../services/Admin/Department/departmentService";

function DepartmentFormModal({
  open,
  setOpen,
  fetchDepartments,
  editingDepartment

}) {

  const [form] = Form.useForm();

  useEffect(() => {

    if (editingDepartment) {

      form.setFieldsValue(
        editingDepartment
      );
    }

    else {

      form.resetFields();
    }

  }, [editingDepartment]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // update
      if (editingDepartment) {
        await updateDepartment(
          editingDepartment._id,
          values
        );
        fetchDepartments();
        message.success(
          "Updated successfully"
        );
        setOpen(false);

      }

      // create
      else {
        await createDepartment(values);
        fetchDepartments();
        message.success(
          "Added successfully"
        );
        setOpen(false);

      }
      // reset form
      form.resetFields();

      // reset editing
      setEditingDepartment(null);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (

    <Modal
      title={
        editingDepartment
          ? "Update Department"
          : "Add Department"
      }

      open={open}

      onOk={handleSubmit}

      onCancel={() =>
        setOpen(false)
      }
    >

      <Form
        form={form}
        layout="vertical"
      >

        <Form.Item
          name="name"
          label="Department Name"

          rules={[
            {
              required: true,
              message:
                "Department name is required"
            }
          ]}
        >
          <Input />
        </Form.Item>

      </Form>

    </Modal>
  );
}

export default DepartmentFormModal;