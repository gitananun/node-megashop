const { MongoClient } = require('mongodb');

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
    .then((client) => callback(client))
    .catch((err) => console.log(err));
};

module.exports = mongoConnect;
