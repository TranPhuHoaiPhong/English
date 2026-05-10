const mongoose = require("mongoose");
const Department = require("./Department");

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    code: {
      type: String,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      match:
        /^(0|\+84)[0-9]{9}$/
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    role: {
      type: String,

      enum: [
        "admin",
        "employee",
        "manager"
      ],

      default: "employee"
    },

    password: {
      type: String,
      required: true
    },

    leaveBalance: {
      type: Number,
      default: 13
    },

    leaveBalanceYear: {
      type: Number,
      default: () =>
        new Date().getFullYear()
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    }
  },

  {
    timestamps: true
  }
);


// ======================
// GENERATE CODE
// ======================

async function generateCode(
  departmentId
) {

  const random =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  let prefix = "EMP";

  // 📌 tìm department
  const department =
    await Department.findById(
      departmentId
    );

  // 📌 có department
  if (department?.name) {

    prefix =
      department.name
        .replace(/\s+/g, "")
        .substring(0, 3)
        .toUpperCase();
  }

  return `${prefix}-${random}`;
}


// ======================
// PRE SAVE
// ======================

EmployeeSchema.pre(
  "save",

  async function () {

    // 📌 reset leave mỗi năm
    const currentYear =
      new Date().getFullYear();

    if (
      this.leaveBalanceYear !==
      currentYear
    ) {

      this.leaveBalance = 13;

      this.leaveBalanceYear =
        currentYear;
    }

    // 📌 generate code
    if (!this.code) {

      let isUnique = false;

      while (!isUnique) {

        const newCode =
          await generateCode(
            this.department
          );

        const existing =
          await mongoose.models.Employee.findOne({
            code: newCode
          });

        if (!existing) {

          this.code = newCode;

          isUnique = true;
        }
      }
    }
  }
);

module.exports =
  mongoose.model(
    "Employee",
    EmployeeSchema
  );