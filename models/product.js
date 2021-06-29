const dirPath = require("../utils/path");

const path = require("path");

const fs = require("fs");

module.exports = class Product {
  constructor({ title, imageUrl, price, description }) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    const p = path.join(dirPath, "data", "products.json");

    fs.readFile(p, (err, data) => {
      let products = [];

      if (!err) {
        products = JSON.parse(data);
      }

      products.push(this);

      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static fetchAll(cb) {
    const p = path.join(dirPath, "data", "products.json");

    fs.readFile(p, (err, data) => {
      if (err) {
        cb([]);
      }

      cb(JSON.parse(data));
    });
  }
};
