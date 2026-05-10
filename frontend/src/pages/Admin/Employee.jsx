import { useState } from "react";
import { useEffect } from "react";
import { Form, message } from "antd";

import {
  departmentsData
} from "../../services/Admin/Employee/employeeData";
import { getDepartments } from "../../services/Admin/Department/departmentService";


import removeVietnameseTones from "../../utils/removeVietnameseTones";

import EmployeeFilter from "../../components/Admin/Employee/EmployeeFilter";
import EmployeeTable from "../../components/Admin/Employee/EmployeeTable";
import EmployeeModal from "../../components/Admin/Employee/EmployeeModal";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "../../services/Admin/Employee/employeeService";

function EmployeePage() {
  const [departments, setDepartments] = useState([]);
  const [data, setData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [roleFilter, setRoleFilter] = useState("employee");

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setData(data);
      const departments = await getDepartments();
      setDepartments(departments);
    } catch (error) {
      console.log(error);
      message.error("Can not fetch employees");
    }
  };

  const [form] = Form.useForm();

  const rolePriority = {
    admin: 1,
    manager: 2,
    employee: 3
  };
  
  const filteredData = data
    .filter((item) => {
      const matchRole =
        roleFilter === "ALL" ||
        item.role === roleFilter;

      const keyword = removeVietnameseTones(
        searchText.toLowerCase()
      );

      const matchSearch =
        removeVietnameseTones(
          item.name.toLowerCase()
        ).includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        (item.phone || "").includes(keyword);

      return matchRole && matchSearch;
    })

    .sort((a, b) => {
      if (roleFilter !== "ALL") return 0;

      return (
        (rolePriority[a.role] || 99) -
        (rolePriority[b.role] || 99)
      );
    });

  const openModal = (record = null) => {
    setEditingEmployee(record);

    setIsModalOpen(true);

    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  const handleSubmit = async () => {
    try {

      const values = await form.validateFields();

      if (editingEmployee) {
        const data = await updateEmployee(
          editingEmployee._id,
          values
        );

        message.success("Updated successfully");
      } 
      
      else {
        const data = await createEmployee(values);

        message.success("Added successfully");
      }

      await fetchEmployees();

      setIsModalOpen(false);

    } catch (error) {

      console.log(error);

      message.error("An error occurred");
    }
  };

  const handleDelete = async (id) => {
    try {

      await deleteEmployee(id);

      message.success("Deleted successfully");

      await fetchEmployees();

    } catch (error) {

      console.log(error);

      message.error("Failed to delete employee");
    }
  };

  return (
    <>
      <EmployeeFilter
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        openModal={openModal}
      />

      <EmployeeTable
        filteredData={filteredData}
        departments={departments}
        openModal={openModal}
        handleDelete={handleDelete}
      />

      <EmployeeModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSubmit={handleSubmit}
        editingEmployee={editingEmployee}
        form={form}
        departments={departments}
      />
    </>
  );
}

export default EmployeePage;