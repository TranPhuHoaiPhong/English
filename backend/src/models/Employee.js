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
    department: String,
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    role: {
      type: String,
      enum: ["admin", "member"], 
      default: "member",         
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


function generateCode() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EMP-${random}`;
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