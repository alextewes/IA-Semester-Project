const mongoose = require('mongoose');
const Salesorder = require('Salesorder.model');
const PerformanceRecord = require('PerformanceRecord.model');

const BonusComputationSheetSchema = mongoose.Schema({
    bcid: Number,
    sid: Number,
    salesorders: [Salesorder],
    performanceRecord: [PerformanceRecord]
});

module.exports = mongoose.model('BonusComputationSheet', BonusComputationSheetSchema);