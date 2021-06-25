const express = require("express");
const path = require("path");
const router = express.Router();

const rootDir = require("../utils/path");

router.use("/", (_, res, __) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

module.exports = router;
