const useEnv = require("./utils/env");
const { mongoConnect } = require("./utils/database");

const express = require("express");
const path = require("path");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const systemRouter = require("./routes/system");

const app = express();

useEnv();

app.set("view engine", "ejs");
app.set("views", "views"); // where to find templates

app.use(express.urlencoded({ extended: true })); // Allow parsing the request body
app.use(express.static(path.join(__dirname, "public"))); // Allow access to public static files

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(systemRouter);

mongoConnect(() => {
  app.listen(3000);
});
