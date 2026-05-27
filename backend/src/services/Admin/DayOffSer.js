const DayOff = require("../../models/Dayoff");

const createDayOffService = async (data) => {
  try {
    const newdayoff = await DayOff.create(data || {});

    return {
      status: "OK",
      message: "Create dayoff success",
      data: newdayoff,
    };
  } catch (error) {
    throw error;
  }
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

const updateHolidayService =
  async (id, data) => {

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

const deleteHolidayService =
  async (id) => {

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
  createDayOffService
};