const CompanyHoliday = require("../../models/CompanyHoliday");

const createHolidayService = async (data) => {

  const {
    name,
    startDate,
    endDate,
    type,
    isPaid,
    description
  } = data;

  if (
    !name ||
    !startDate ||
    !endDate
  ) {

    return {
      status: "ERROR",
      message:
        "Missing required fields"
    };
  }

  const start =
    new Date(startDate);

  const end =
    new Date(endDate);

  start.setHours(
    0,
    0,
    0,
    0
  );

  end.setHours(
    23,
    59,
    59,
    999
  );

  if (start > end) {

    return {
      status: "ERROR",
      message:
        "Start date must be before end date"
    };
  }

  // ===== check overlap holiday =====

  const existedHoliday =
    await CompanyHoliday.findOne({

      startDate: {
        $lte: end
      },

      endDate: {
        $gte: start
      }
    });

  if (existedHoliday) {

    return {

      status: "ERROR",

      message:
        "Holiday already exists or overlaps with another holiday"
    };
  }

  // ===== create =====

  const newHoliday =
    await CompanyHoliday.create({

      name,

      startDate,

      endDate,

      type,

      isPaid,

      description
    });

  return {

    status: "SUCCESS",

    data: newHoliday
  };
};

const getAllHolidaysService = async () => {
    const holidays = await CompanyHoliday
        .find()
        .sort({
          startDate: 1
        });

    return {
      status: "SUCCESS",
      data: holidays
    };
};

const updateHolidayService = async (id, data) => {

    const holiday =
      await CompanyHoliday
        .findById(id);

    if (!holiday) {

      return {
        status: "ERROR",
        message:
          "Holiday not found"
      };
    }

    const updatedHoliday =
      await CompanyHoliday
        .findByIdAndUpdate(

          id,

          data,

          {
            new: true
          }
        );

    return {

      status: "SUCCESS",

      data: updatedHoliday
    };
};

const deleteHolidayService = async (id) => {

    const holiday =
      await CompanyHoliday
        .findById(id);

    if (!holiday) {

      return {
        status: "ERROR",
        message:
          "Holiday not found"
      };
    }

    await CompanyHoliday
      .findByIdAndDelete(id);

    return {

      status: "SUCCESS",

      message:
        "Holiday deleted successfully"
    };
};

module.exports = {

  createHolidayService,

  getAllHolidaysService,

  updateHolidayService,

  deleteHolidayService
};