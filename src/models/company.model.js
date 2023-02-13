const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
  companyCode: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  CEO: { type: String, required: true },
  turnover: { type: Number, required: true, min: [100000001, 'Must be at least 100000001, got {VALUE}'] },
  website: { type: String, required: true },
  stockExchange: { type: String, required: true },
});

/**
 * @typedef Company
 */
module.exports = mongoose.model('company', companySchema);
