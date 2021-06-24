const express = require("express");

const router = express.Router();

router.get("/", (req, res, _) => {
  res.send("<h1>Hi from Home</h1>");
});

module.exports = router;
