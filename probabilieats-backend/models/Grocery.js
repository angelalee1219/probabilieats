const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the grocery item
  barcode: { type: String, unique: true }, // Optional barcode field
  expirationDate: { type: Date }, // Expiration date
  typicalShelfLife: { type: Number }, // Number of days
  quantity: { type: Number, default: 1 }, // Quantity of the item
});

module.exports = mongoose.model('Grocery', grocerySchema);
