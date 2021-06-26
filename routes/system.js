const express = require("express");
const path = require("path");
const router = express.Router();

const rootDir = require("../utils/path");

router.use("/", (_, res, __) => {
  res.status(404).render("404", {
    path: "/404",
    pageTitle: "404 Not found",
  });
});

module.exports = router;
