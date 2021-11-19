const mongoose = require('mongoose');

const PerformanceRecordSchema = mongoose.Schema({
    erid: Number,
    actualValue: Number,
    targetValue: Number,
    year: Number,
    goalDesc: String,
    sid: Number

});

module.exports = mongoose.model('PerformanceRecord', PerformanceRecordSchema);