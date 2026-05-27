const mongoose = require("mongoose");

const DayOffSchema = new mongoose.Schema(
  {
    MARRIAGE: {
      type: Number,
      default: 3,
    },
    CHILD_MARRIAGE: {
      type: Number,
      default: 1,
    },
    FUNERAL: {
      type: Number,
      default: 3,
    },
    MILITARY_EXAM: {
      type: Number,
      default: 1,
    },
    FOREIGN_VISIT: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DayOff", DayOffSchema);