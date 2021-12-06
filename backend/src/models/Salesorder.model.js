const mongoose = require('mongoose');

const SalesorderSchema = mongoose.Schema({
    id: Number,
    customerName: String,
    year: Number,
    clientRanking: Number,
    product: String,
    items: Number
});

module.exports = mongoose.model('Salesorder', SalesorderSchema);