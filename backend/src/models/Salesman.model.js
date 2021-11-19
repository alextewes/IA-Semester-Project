const mongoose = require('mongoose');

const SalesmanSchema = mongoose.Schema({
    sid: Number,
    firstName: String,
    lastName: String,
    dob: String,
    experience: String

});

module.exports = mongoose.model('Salesman', SalesmanSchema);