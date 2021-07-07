const mongodb = require("mongodb");
const { getDB } = require("../utils/database");

class Product {
  constructor({ title, price, description, imageUrl, id }) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectID(id) : null;
  }

  save() {
    const db = getDB();
    let operation;

    if (this._id) {
      operation = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else operation = db.collection("products").insertOne(this);

    return operation.catch((e) => console.log(e));
  }

  static fetchAll() {
    const db = getDB();

    return db
      .collection("products")
      .find()
      .toArray()
      .catch((e) => console.log(e));
  }

  static findById(id) {
    const db = getDB();

    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectID(id) })
      .next()
      .catch((e) => console.log(e));
  }

  static deleteById(id) {
    const db = getDB();

    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectID(id) })
      .catch((e) => console.log(e));
  }
}

module.exports = Product;
