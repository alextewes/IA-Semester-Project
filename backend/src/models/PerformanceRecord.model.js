const mongoose = require('mongoose');

const PerformanceRecordSchema = new mongoose.Schema({
    actualValue: Number,
    targetValue: Number,
    year: Number,
    goalDesc: String,
    sid: Number

});

module.exports = mongoose.model('PerformanceRecord', PerformanceRecordSchema);