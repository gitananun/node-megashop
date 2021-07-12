const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    username: {
      type: String,
      required: false,
    },
    userId: {
      ref: 'User',
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
});

module.exports = mongoose.model('Order', orderSchema);
