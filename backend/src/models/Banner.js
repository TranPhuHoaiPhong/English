const mongoose =
  require("mongoose");

const BannerSchema =
  new mongoose.Schema(
    {
      banner: {
        fileName: {
          type: String,
          required: true
        }
      }
    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    "Banner",
    BannerSchema
  );