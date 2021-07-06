const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('product', {
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

module.exports = Product;
