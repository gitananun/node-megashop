const express = require("express");
const path = require("path");

const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Product = require("./models/product");
const User = require("./models/user");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const systemRouter = require("./routes/system");

const sequelize = require("./utils/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // where to find templates

app.use(express.urlencoded({ extended: true })); // Allow parsing the request body
app.use(express.static(path.join(__dirname, "public"))); // Allow access to public static files

app.use((req, _, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((e) => console.log(e));
});

app.use(shopRouter);
app.use("/admin", adminRouter);
app.use(systemRouter);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  .sync({ force: false })
  .then(() => User.findByPk(1))
  .then((user) => {
    if (!user)
      return User.create({
        name: "Tigran",
        email: "tigran.muradyan140201@gmail.com",
      });

    return user;
  })
  .then((user) => user.createCart())
  .then(() => app.listen(3000))
  .catch((e) => console.error(e));
