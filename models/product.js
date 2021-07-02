const path = require("path");
const Cart = require("../models/cart");

const fs = require("fs");

const dirPath = require("../utils/path");
const titleToSlug = require("../utils/slug");

const p = path.join(dirPath, "data", "products.json");

module.exports = class Product {
  constructor({ id, title, imageUrl, price, description }) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    fs.readFile(p, (err, data) => {
      let products = [];

      if (!err) {
        products = JSON.parse(data);
      }

      if (this.id) {
        const existingProductIndex = products.findIndex(
          (p) => p.id === this.id
        );
        const updatedProducts = [...products];
        this.id = titleToSlug(this.title);
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          if (err) {
            console.log(err);
          }
        });
      } else {
        this.id = titleToSlug(this.title);
        products.push(this);

        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }

  static deleteById(id) {
    this.fetchAll((products) => {
      const product = products.find((p) => p.id == id);
      const updatedProducts = products.filter((prod) => prod.id !== id);

      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static saveProducts(products) {
    fs.writeFile(p, JSON.stringify(products), (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  static fetchAll(cb) {
    fs.readFile(p, (err, data) => {
      if (err) cb([]);
      cb(JSON.parse(data));
    });
  }

  static findById(id, cb) {
    this.fetchAll((products) => {
      cb(products.find((p) => p.id == id));
    });
  }
};
