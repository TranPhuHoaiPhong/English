const DepartmentService = require(
  "../services/DepartmentSer"
);

const createDepartment = async (req, res) => {

  try {

    const result =
      await DepartmentService
        .createDepartmentService(
          req.body
        );

    if (result.status === "ERROR") {

      return res.status(400).json(result);
    }

    return res.status(201).json(result);

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      status: "ERROR",

      message: "Server error"
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const result =
      await DepartmentService
        .getDepartmentService();

    if (result.status === "ERROR") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Server error"
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const result =
      await DepartmentService
        .updateDepartmentService(
          req.params.id,
          req.body
        );
    if (result.status === "ERROR") {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERROR",
      message: "Server error"
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const result =
      await DepartmentService
        .deleteDepartmentService(
          req.params.id
        );
    if (result.status === "ERROR") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Server error"
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment
};