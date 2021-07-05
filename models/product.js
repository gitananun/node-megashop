const Cart = require("../models/cart");
const db = require("../utils/database");

module.exports = class Product {
  constructor({ title, imageUrl, price, description }) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  static deleteById(id) {}

  static saveProducts(products) {}

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE id = ?", [id]);
  }
};
