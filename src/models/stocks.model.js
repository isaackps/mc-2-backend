const mongoose = require('mongoose');

const stockSchema = mongoose.Schema(
  {
    price: { type: Number },
  },
  { timestamps: true }
);

const stocksSchema = mongoose.Schema({
  companyCode: { type: Number, required: true, unique: true },
  stockPrices: [stockSchema],
});

/**
 * @typedef Company
 */
module.exports = mongoose.model('stocks', stocksSchema);
