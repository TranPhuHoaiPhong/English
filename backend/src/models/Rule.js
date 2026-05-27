const mongoose = require("mongoose");

const RuleSchema = new mongoose.Schema(
  {
    ANNUAL: {
      type: Number,
      default: 3,
    },
    MARRIAGE: {
      type: Number,
      default: 7,
    },
    CHILD_MARRIAGE: {
      type: Number,
      default: 7,
    },
    FUNERAL: {
      type: Number,
      default: 0,
    },
    MILITARY_EXAM: {
      type: Number,
      default: 7,
    },
    WORK_ACCIDENT: {
      type: Number,
      default: 0,
    },
    FOREIGN_VISIT: {
      type: Number,
      default: 10,
    },
    SICK: {
      type: Number,
      default: 0,
    },
    MATERNITY: {
      type: Number,
      default: 0,
    },
    PERSONAL: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rule", RuleSchema);