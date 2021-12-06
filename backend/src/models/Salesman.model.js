const mongoose = require('mongoose');

const SalesmanSchema = mongoose.Schema({
    _id: Number,
    firstName: String,
    lastName: String,
    dob: String,
    experience: String,
    department: String
});

module.exports = mongoose.model('Salesman', SalesmanSchema);