const mongoose = require('mongoose');

const BonusComputationSchema = new mongoose.Schema({
    bcid: {type: Number, index: true},
    sid: Number,
    year: Number,
    value: Number
});

module.exports = mongoose.model('BonusComputation', BonusComputationSchema);