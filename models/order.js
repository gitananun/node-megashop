const sequelize = require('../utils/database');

const Order = sequelize.define('order', {});

module.exports = Order;
