// services/BannerService.js

const Banner = require("../../models/Banner");

const createBannerService = async (data) => {
  try {

    // check old banner
    const existingBanner =
      await Banner.findOne();

    // update if exists
    if (existingBanner) {

      existingBanner.banner =
        data.banner;

      await existingBanner.save();

      return {
        status: "SUCCESS",
        message:
          "Banner updated successfully",
        data: existingBanner
      };
    }

    // create new banner
    const newBanner =
      await Banner.create(data);

    return {
      status: "SUCCESS",
      message:
        "Banner created successfully",
      data: newBanner
    };

  } catch (error) {

    console.log(error);

    return {
      status: "ERROR",
      message: "Server error"
    };
  }
};

const getBannerService = async () => {
  try {

    const banner = await Banner.findOne();

    if (!banner) {
      return {
        status: "ERROR",
        message: "Banner not found"
      };
    }

    return {
      status: "SUCCESS",
      data: banner
    };

  } catch (error) {

    console.log(error);

    return {
      status: "ERROR",
      message: "Server error"
    };
  }
};

module.exports = {
  createBannerService,
  getBannerService
};