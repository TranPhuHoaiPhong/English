const mongoose = require("mongoose");

const CompanyHolidaySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: [
        "PUBLIC",
        "COMPANY",
        "TET",
        "SPECIAL"
      ],
      default: "PUBLIC"
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  });

module.exports =
  mongoose.model(
    "CompanyHoliday",
    CompanyHolidaySchema
);