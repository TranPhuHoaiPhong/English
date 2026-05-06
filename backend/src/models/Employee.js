const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^(0|\+84)[0-9]{9}$/,
    },
    department: String,
    role: {
      type: String,
      enum: ["admin", "employee", "manager"],
      default: "employee",         
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


function generateCode(department) {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  // lấy 2-3 ký tự đầu của department
  const prefix = department
    ? department.replace(/\s+/g, "").substring(0, 3).toUpperCase()
    : "EMP";

  return `${prefix}-${random}`;
}

EmployeeSchema.pre("save", async function () {
  if (!this.code) {
    let isUnique = false;

    while (!isUnique) {
      const newCode = generateCode();

      const existing = await mongoose.models.Employee.findOne({
        code: newCode,
      });

      if (!existing) {
        this.code = newCode;
        isUnique = true;
      }
    }
  }
});

module.exports = mongoose.model("Employee", EmployeeSchema);