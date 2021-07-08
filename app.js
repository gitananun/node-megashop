const useEnv = require('./utils/env');
const { mongoConnect } = require('./utils/database');

const express = require('express');
const path = require('path');
const User = require('./models/user');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const systemRouter = require('./routes/system');

const app = express();

useEnv();

app.set('view engine', 'ejs');
app.set('views', 'views'); // where to find templates

app.use(express.urlencoded({ extended: true })); // Allow parsing the request body
app.use(express.static(path.join(__dirname, 'public'))); // Allow access to public static files

app.use((req, _, next) => {
  User.findById('60e68e803a406ec87ace14ed')
    .then((user) => {
      req.user = new User({
        username: user.username,
        email: user.email,
        cart: user.cart,
        id: user._id,
      });
      next();
    })
    .catch((e) => console.log(e));
});

app.use(shopRouter);
app.use('/admin', adminRouter);
app.use(systemRouter);

mongoConnect(() => {
  app.listen(3000);
});
