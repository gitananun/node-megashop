const sequelize = require("../utils/database");

const Cart = sequelize.define("cart", {});

module.exports = Cart;
