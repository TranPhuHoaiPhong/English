const multer = require("multer");

const path = require("path");

const fs = require("fs");

// ===== upload folder =====

const uploadDir =
  path.join(
    __dirname,
    "../../uploads"
  );

// tự tạo nếu chưa có

if (
  !fs.existsSync(uploadDir)
) {

  fs.mkdirSync(
    uploadDir,
    { recursive: true }
  );
}

const storage =
  multer.diskStorage({

    destination:
      (req, file, cb) => {

        cb(
          null,
          uploadDir
        );
      },

    filename:
      (req, file, cb) => {

        const unique =
          Date.now() +
          "-" +
          Math.round(
            Math.random() * 1E9
          );

        cb(
          null,
          unique +
          path.extname(
            file.originalname
          )
        );
      }
  });

const upload =
  multer({ storage });

module.exports = upload;