const mongoose = require("mongoose");
const Department = require("./Department");

// ======================
// CALCULATE LEAVE (FIXED - YEAR BASED)
// ======================
function calculateLeave(employee) {
  const now = new Date();
  const hireDate = new Date(employee.hireDate);

  // ❗ chỉ tính trong NĂM HIỆN TẠI (reset mỗi năm)
  const currentYear = now.getFullYear();

  let monthsWorked = now.getMonth() + 1;

  // nếu nhân viên mới vào trong năm hiện tại
  if (hireDate.getFullYear() === currentYear) {
    const startMonth = hireDate.getMonth() + 1;

    monthsWorked = now.getMonth() - hireDate.getMonth() + 1;

    if (monthsWorked < 1) monthsWorked = 1;
  }

  // thâm niên (vẫn giữ theo năm)
  const yearsWorked = currentYear - hireDate.getFullYear();
  const seniorityBonus = Math.floor(yearsWorked / 5);

  // độc hại
  const hazardousBonus = employee.isHazardousWork ? 2 : 0;

  return monthsWorked + seniorityBonus + hazardousBonus;
}

// ======================
// GENERATE CODE
// ======================
async function generateCode(departmentId) {
  const random = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  let prefix = "EMP";

  if (departmentId) {
    const department = await Department.findById(departmentId);

    if (department?.name) {
      prefix = department.name
        .replace(/\s+/g, "")
        .substring(0, 3)
        .toUpperCase();
    }
  }

  const timestamp = Date.now().toString().slice(-4);

  return `${prefix}-${timestamp}-${random}`;
}

// ======================
// SCHEMA
// ======================
const EmployeeSchema = new mongoose.Schema(
  {
    name: String,

    code: {
      type: String,
      unique: true,
      sparse: true
    },

    email: { type: String, unique: true },
    phone: { type: String, unique: true },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "employee", "manager"],
      default: "employee"
    },

    password: String,

    hireDate: {
      type: Date,
      default: Date.now
    },

    isHazardousWork: {
      type: Boolean,
      default: false
    },

    leaveBalance: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

// ======================
// PRE SAVE
// ======================
EmployeeSchema.pre("save", async function () {
  // tạo mới nhân viên → tính phép năm hiện tại
  if (this.isNew) {
    this.leaveBalance = calculateLeave(this);
  }

  // generate code an toàn
  if (!this.code) {
    this.code = await generateCode(this.department);
  }
});

module.exports = mongoose.model("Employee", EmployeeSchema);