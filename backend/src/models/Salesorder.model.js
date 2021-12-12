const mongoose = require('mongoose');

const SalesorderSchema = new mongoose.Schema({
    sid: Number,
    year: Number,
    product: String,
    customerName: String,
    clientRanking: Number,
    items: Number,
    bonus: Number
});

module.exports = mongoose.model('Salesorder', SalesorderSchema);