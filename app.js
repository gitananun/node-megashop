const useEnv = require('./utils/env');
const mongoose = require('mongoose');

useEnv();

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');

const etcController = require('./controllers/etc');

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

app.use(etcController.saveUserSession);

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.use(systemRouter);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_) => app.listen(3000))
  .catch((e) => {
    throw new Error(e);
  });
