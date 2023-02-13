const mongoose = require("mongoose");

Schema = mongoose.Schema;

const companySchema = new Schema({
  companyCode: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  CEO: { type: String, required: true },
  turnover: { type: Number, required: true, min: 100000000 },
  website: { type: String, required: true },
  stockExchange: { type: String, required: true },
});

module.exports = mongoose.model("company", companySchema);
