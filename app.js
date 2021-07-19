const useEnv = require('./utils/env');
const mongoose = require('mongoose');

useEnv();

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const path = require('path');
const flash = require('connect-flash');

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
const csrfProtection = csrf();

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
app.use(flash());
app.use(csrfProtection);
app.use(etcController.saveUserSession);
app.use(etcController.prepareResponseLocals);

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.use(systemRouter);
app.use((_, req, res, next) => res.redirect('/500'));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_) => app.listen(3000))
  .catch((e) => {
    throw new Error(e);
  });
