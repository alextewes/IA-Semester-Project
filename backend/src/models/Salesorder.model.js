const mongoose = require('mongoose');

const SalesorderSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    sid: Number,
    year: Number,
    product: String,
    customerName: String,
    clientRanking: Number,
    items: Number,
    bonus: Number
});

module.exports = mongoose.model('Salesorder', SalesorderSchema);