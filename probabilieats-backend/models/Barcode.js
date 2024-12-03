const mongoose = require('mongoose');

const BarcodeSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  expirationDate: { type: String, required: true },
  inFridge: { type: Boolean, default: true }, // New field
});

module.exports = mongoose.model('Barcode', BarcodeSchema);
