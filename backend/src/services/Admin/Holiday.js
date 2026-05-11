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

    if (
      new Date(startDate) >
      new Date(endDate)
    ) {

      return {
        status: "ERROR",
        message:
          "Start date must be before end date"
      };
    }

    const newHoliday =
      await CompanyHoliday
        .create({
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

  createHolidayService,

  getAllHolidaysService,

  updateHolidayService,

  deleteHolidayService
};