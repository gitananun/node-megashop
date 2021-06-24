const express = require("express");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(shopRouter);
app.use(adminRouter);

app.use((req, res, next) => {
  res.status(404).send("<h1>Page not found</h1>");
});

app.listen(3000);
