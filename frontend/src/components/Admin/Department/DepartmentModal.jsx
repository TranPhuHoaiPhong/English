import {
  Modal,
  Button,
  message,
  Spin
} from "antd";

import { useState } from "react";
import DepartmentTable from "./DepartmentTable";
import DepartmentFormModal from "./DepartmentFormModal";
import { deleteDepartment } from "../../../services/Admin/Department/departmentService";

function DepartmentModal({
  open,
  setOpen,
  departments,
  fetchDepartments
}) {

  const [
    openFormModal,
    setOpenFormModal
  ] = useState(false);

  const [
    editingDepartment,
    setEditingDepartment
  ] = useState(null);

  const openAddModal = () => {
    setEditingDepartment(null);
    setOpenFormModal(true);
  };

  const openEditModal = (record) => {
    setEditingDepartment(record);
    setOpenFormModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      await fetchDepartments();
      message.success("Deleted successfully")
    } catch (error) {
      console.log("ee", error)
      message.error("Failed to delete department");
    }
  };

  return (
    <> 
      <Modal
        title="Department Management"
        open={open}
        footer={null}
        width={900}
        onCancel={() => setOpen(false)}
      >

        <div
          style={{
            marginBottom: 16,
            textAlign: "right"
          }}
        >
          <Button
            type="primary"
            onClick={openAddModal}
          >
            Add Department
          </Button>
        </div>

        <DepartmentTable
          departments={departments}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
        />

      </Modal>

      <DepartmentFormModal
        open={openFormModal}
        setOpen={setOpenFormModal}
        editingDepartment={editingDepartment}
        fetchDepartments={fetchDepartments}
      />
    </>
  );
}

export default DepartmentModal;