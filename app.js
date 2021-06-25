const express = require("express");
const path = require("path");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const systemRouter = require("./routes/system");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(shopRouter);
app.use("/admin", adminRouter);

app.use(systemRouter);

app.listen(3000);
