const mongoose = require('mongoose');

const SalesorderSchema = mongoose.Schema({
    id: Number,
    sid: Number,
    year: Number,
    product: String,
    customerName: String,
    clientRanking: Number,
    items: Number,
    bonus: Number
});

module.exports = mongoose.model('Salesorder', SalesorderSchema);