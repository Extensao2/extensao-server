const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productTypes = ['headwear', 'gloves', 'weapon', 'footwear'];
const productRarities = ['common', 'rare', 'legendary'];

const productSchema = new Schema({
  name: { type: String, required: true },
  url: String,
  price: { type: Number, default: 0 },
  type: { type: String, enum: productTypes, required: true },
  rarity: { type: String, enum: productRarities, required: true }
});

const Product = model('Product', productSchema);

module.exports = { Product };