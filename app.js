const express = require("express");
const path = require("path");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const systemRouter = require("./routes/system");

const sequelize = require("./utils/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // where to find templates

app.use(express.urlencoded({ extended: true })); // Allow parsing the request body
app.use(express.static(path.join(__dirname, "public"))); // Allow access to public static files

app.use(shopRouter);
app.use("/admin", adminRouter);
app.use(systemRouter);

sequelize
  .sync()
  .then(() => app.listen(3000))
  .catch((e) => console.error(e));
