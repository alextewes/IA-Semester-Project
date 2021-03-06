const PerformanceRecord = require('../models/PerformanceRecord.model.js')


exports.create = async function(req, res) {
    try {
        // create performanceRecord
        const performanceRecord = new PerformanceRecord({
            actualValue: req.body.actualValue,
            targetValue: req.body.targetValue,
            year: req.body.year,
            goalDesc: req.body.goalDesc,
            sid: req.body.sid,
            bonus: req.body.bonus
        });
        // save performanceRecord in database
        const data = await performanceRecord.save();
        res.send(data);
    }
    catch (err){
        res.status(500).send({
            message: err || 'There was a problem creating the performanceRecord!'
        })
    }
};

exports.findBySidAndYear = async function(req, res) {
    try {
        const performanceRecord = await PerformanceRecord.find({sid: req.params.sid, year: req.params.year});
        if(!performanceRecord) {
            return res.status(404).send({message: "performanceRecord not found!"});
        }
        res.send(performanceRecord);
    }
    catch(err) {
        res.status(400).send({message: err.message});
    }
}

exports.findAll = async function(req, res) {
    try {
        const performanceRecord = await PerformanceRecord.find();
        res.send(performanceRecord);
    }
    catch (err) {
        err.send({message: err});
    }
};

exports.update = async function(req, res) {
    try {
        const performanceRecord = await PerformanceRecord.findByIdAndUpdate(req.params._id, {
            actualValue: req.body.actualValue,
            targetValue: req.body.targetValue,
            year: req.body.year,
            goalDesc: req.body.goalDesc,
            sid: req.body.sid,
            bonus:req.body.bonus
        }, {new: true});
        res.send(performanceRecord);
    }
    catch (err) {
        res.status(500).send({
            message: err
        });
    }
};

exports.delete = async function(req, res) {
    try {
        const performanceRecord = await PerformanceRecord.findByIdAndUpdate(req.params._id);
        if(!performanceRecord) {
            res.status(404).send({
                message: "Performance Record not found with prid: " + req.params.prid
            });
        }
        res.send({message: "performanceRecord deleted!"});
    }
    catch (err) {
        res.status(500).send({
            message: err
        });
    }
};