const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin");
const clientRoutes = require("./client");

router.use("/admin", adminRoutes);
router.use("/client", clientRoutes);

module.exports = router;