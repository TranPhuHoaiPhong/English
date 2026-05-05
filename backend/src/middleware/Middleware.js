const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "ERROR",
        message: "Token không tồn tại",
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          status: "ERROR",
          message: "Token không hợp lệ",
        });
      }

      if (decoded.role === "admin") {
        req.user = decoded; // lưu thông tin user vào req để các middleware sau dùng
        next();
      } else {
        return res.status(403).json({
          status: "ERROR",
          message: "Bạn không có quyền truy cập (chỉ dành cho Admin)",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi xác thực",
    });
  }
};

const authUserMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token?.split(" ")[1];
    const userId = req.params.id;

    if (!token) {
      return res.status(401).json({
        status: "ERROR",
        message: "Token không tồn tại",
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          status: "ERROR",
          message: "Token không hợp lệ",
        });
      }

      if (decoded.role === "admin" || decoded._id == userId) {
        req.user = decoded;
        next();
      } else {
        return res.status(403).json({
          status: "ERROR",
          message: "Bạn không có quyền truy cập tài khoản này",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi xác thực người dùng",
    });
  }
};

const authUserApp = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      status: "ERROR",
      message: "Token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(404).json({
        status: "ERROR",
        message: "Token khong hop le",
      });
    }

    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin || false;

    next();
  });
};


module.exports = {
  authMiddleware, // chỉ cho admin
  authUserMiddleware, // cho admin hoặc chính user
  authUserApp, // xác thực cho app (member)
};
