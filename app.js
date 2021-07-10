const useEnv = require('./utils/env');
const mongoose = require('mongoose');

useEnv();

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');

const User = require('./models/user');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const systemRouter = require('./routes/system');

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'auth-sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views'); // where to find templates

app.use(express.urlencoded({ extended: true })); // Allow parsing the request body
app.use(express.static(path.join(__dirname, 'public'))); // Allow access to public static files
app.use(
  session({
    secret: 'megashop',
    saveUninitialized: false,
    resave: false,
    store: store,
  })
);

app.use((req, _, next) => {
  User.findById('60e7deeb1d185204bf1ff19a')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((e) => console.log(e));
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.use(systemRouter);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          username: 'tigran.muradyan',
          email: 'tigran@muradyan.com',
          cart: { items: [] },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((e) => {
    throw new Error(e);
  });
