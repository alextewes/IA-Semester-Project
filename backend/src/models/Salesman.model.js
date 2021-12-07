const mongoose = require('mongoose');

const SalesmanSchema = new mongoose.Schema({
    _id: Number,
    employeeId: Number,
    firstName: String,
    lastName: String,
    dob: String,
    department: String
});

module.exports = mongoose.model('Salesman', SalesmanSchema);