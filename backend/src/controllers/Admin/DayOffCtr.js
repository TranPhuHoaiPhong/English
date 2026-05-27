const DayOfff = require("../../services/Admin/DayOffSer");

const createDayOff = async (req, res) => {
    try {
      const result = await DayOfff.createDayOffService(req.body);

      if (result.status === "ERROR") 
        {
            return res.status(400).json(result);
        }

      return res.status(201).json(result);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
          status: "ERROR",
          message: "Server error"
        });
    }
};

const getAllHolidays = async (req, res) => {
    try {
      const result = await Holiday.getAllHolidaysService();

      return res.status(200).json(result);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
          status: "ERROR",
          message: "Server error"
        });
    }
};

const updateHoliday =
  async (req, res) => {

    try {

      const result =
        await Holiday
          .updateHolidayService(
            req.params.id,
            req.body
          );

      if (
        result.status === "ERROR"
      ) {

        return res
          .status(400)
          .json(result);
      }

      return res
        .status(200)
        .json(result);

    } catch (error) {

      console.error(error);

      return res
        .status(500)
        .json({

          status: "ERROR",

          message:
            "Server error"
        });
    }
};

const deleteHoliday =
  async (req, res) => {

    try {

      const result =
        await Holiday
          .deleteHolidayService(
            req.params.id
          );

      if (
        result.status === "ERROR"
      ) {

        return res
          .status(400)
          .json(result);
      }

      return res
        .status(200)
        .json(result);

    } catch (error) {

      console.error(error);

      return res
        .status(500)
        .json({

          status: "ERROR",

          message:
            "Server error"
        });
    }
};

module.exports = {
  createDayOff
};