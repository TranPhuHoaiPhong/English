const express = require("express");
const router = express.Router();

// test client API
router.get("/", (req, res) => {
  res.json({ message: "Client API 🚀" });
});

module.exports = router;