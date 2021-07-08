const { MongoClient } = require('mongodb');

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
    .then((client) => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch((err) => console.log(err));
};

const getDB = () => {
  if (_db) return _db;
  throw Error('No Database Found!');
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
