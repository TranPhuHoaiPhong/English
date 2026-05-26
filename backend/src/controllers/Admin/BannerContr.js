const BannerService = require("../../services/Admin/BannerSer")

const createBanner = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        status: "ERROR",
        message: "Banner image is required"
      });
    }

    const result =
      await BannerService.createBannerService({
        banner: {
          fileName: req.file.filename
        }
      });

    if (result.status === "ERROR") {
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

const getBanner = async (req, res) => {
  try {
    const result =  await BannerService.getBannerService();

    if (result.status === "ERROR") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Server error"
    });
  }
};



module.exports = {
  createBanner,
  getBanner
};