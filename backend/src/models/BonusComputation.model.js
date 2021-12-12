const mongoose = require('mongoose');

const BonusComputationSchema = new mongoose.Schema({
    sid: Number,
    year: Number,
    value: Number,
    performanceRecords: [{type: mongoose.Types.ObjectId, ref:"PerformanceRecord"}],
    salesOrders: [{type: mongoose.Types.ObjectId, ref:"SalesOrder"}]
});

module.exports = mongoose.model('BonusComputation', BonusComputationSchema);