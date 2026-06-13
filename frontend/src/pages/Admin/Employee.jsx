import { useState } from "react";
import { useEffect } from "react";
import { Form, message, Spin } from "antd";
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
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        await Promise.all([
          fetchEmployees(),
        ]);

      } catch (error) {

        message.error("Failed to load dashboard");

      } finally {

        setLoading(false);

      }
    };

    fetchData();

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
    .filter((e) => {
      const roleMatch =
        roleFilter === "ALL" ||
        e.role === roleFilter;

      const statusMatch =
        statusFilter === "ALL" ||
        e.status === statusFilter;

      const departmentMatch =
        departmentFilter === "ALL" ||
        e.department?._id === departmentFilter;

      const searchMatch =
        e.name
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        e.email
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        e.code
          .toLowerCase()
          .includes(searchText.toLowerCase());

      return (
        roleMatch &&
        statusMatch &&
        departmentMatch &&
        searchMatch
      );
    })
    .sort((a, b) =>
      (a.department?.name || "").localeCompare(
        b.department?.name || "",
        "vi"
      )
    );

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
      setLoading(true)
      const values = await form.validateFields();

      if (editingEmployee) {
        const data = await updateEmployee(
          editingEmployee._id,
          values
        );

        message.success("Updated successfully");
      } 
      
      else {
        try {
          const data = await createEmployee(values);

          message.success("Added successfully");

          await fetchEmployees();

          setIsModalOpen(false);

        } catch (error) {
        
          message.error(
            error.response?.data?.message || "Add failed"
          );
        }
      }

    } catch (error) {

      console.log(error);

      message.error("An error occurred");
    }
    finally{
      setLoading(false)
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await deleteEmployee(id);

      message.success("Activated successfully");

      await fetchEmployees();

    } catch (error) {

      console.log(error);

      message.error("Failed to activate employee");
    } finally{
      setLoading(false)
    }
  };

  return (
    <>
      <Spin spinning={loading} size="large">
        <div>
          <EmployeeFilter
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            departments={departments}
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
        </div>
      </Spin>
    </>
  );
}

export default EmployeePage;