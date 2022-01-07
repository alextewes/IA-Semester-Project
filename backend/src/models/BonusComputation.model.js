const mongoose = require('mongoose');

const BonusComputationSchema = new mongoose.Schema({
    sid: Number,
    year: Number,
    value: Number,
    performanceRecords: [{type: mongoose.Types.ObjectId, ref:"PerformanceRecord"}],
    salesOrders: [{type: mongoose.Types.ObjectId, ref:"SalesOrder"}],
    remarks: String
});

module.exports = mongoose.model('BonusComputation', BonusComputationSchema);

/*
const BonusComputationSchema = new mongoose.Schema({
    sid: Number,
    year: Number,
    value: Number,
    performanceRecords: [{
        actualValue: Number,
        targetValue: Number,
        year: Number,
        goalDesc: String,
        sid: Number
    }],
    salesOrders: [{type: mongoose.Types.ObjectId, ref: "SalesOrder"}]
});
 */