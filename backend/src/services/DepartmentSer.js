const Department = require("../models/Department");
const Employee = require("../models/Employee");

const createDepartmentService = async (data) => {

  const { name, description } = data;

  if (!name) {

    return {
      status: "ERROR",
      message: "Department name is required"
    };
  }

  const existingDepartment =
    await Department.findOne({
      name
    });

  if (existingDepartment) {

    return {
      status: "ERROR",
      message: "Department already exists"
    };
  }

  const newDepartment =
    await Department.create({

      name,

      description
    });

  return {

    status: "SUCCESS",

    data: newDepartment
  };
};

const getDepartmentService = async () => {
  const departments = await Department.find();
  return {
    status: "SUCCESS",
    data: departments
  };
};

const updateDepartmentService = async (id, data) => {
    const { name, status } = data;

    if (!name) {
      return {
        status: "ERROR",
        message:
          "Department name is required"
      };
    }

    const department = await Department.findById(id);

    if (!department) {
      return {
        status: "ERROR",
        message:
          "Department not found"
      };
    }

    const existingDepartment =
      await Department.findOne({
        name,
        _id: { $ne: id }
      });

    if (existingDepartment) {
      return {
        status: "ERROR",
        message:
          "Department already exists"
      };
    }

    const updatedDepartment =
      await Department.findByIdAndUpdate(
        id,
        {
          name,
          status
        },
        {
          returnDocument: "after"
        }
      );

    return {
      status: "SUCCESS",
      data: updatedDepartment
    };
  };

const deleteDepartmentService = async (id) => {
    const department = await Department.findById(id);

    if (!department) {
      return {
        status: "ERROR",
        message:
          "Department not found"
      };
    }

     const employeeExists =
      await Employee.findOne({
        department: id
      });

    if (employeeExists) {

      return {
        status: "ERROR",
        message:
          "Can not delete department because employees still exist"
      };
    }

    await Department.findByIdAndDelete(id);

    return {
      status: "SUCCESS",
      message: "Delete department success"
    };
  };

module.exports = {
  createDepartmentService,
  getDepartmentService,
  updateDepartmentService,
  deleteDepartmentService
};