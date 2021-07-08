const mongodb = require('mongodb');
const { getDB } = require('../utils/database');

class Product {
  constructor({ title, price, description, imageUrl, id, userId }) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectID(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDB();
    let operation;

    if (this._id) {
      operation = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else operation = db.collection('products').insertOne(this);

    return operation;
  }

  static fetchAll() {
    const db = getDB();

    return db.collection('products').find().toArray();
  }

  static findById(id) {
    const db = getDB();

    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectID(id) })
      .next();
  }

  static deleteById(id) {
    const db = getDB();

    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectID(id) });
  }
}

module.exports = Product;
