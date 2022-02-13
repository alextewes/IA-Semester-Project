const BonusComputation = require('../models/BonusComputation.model');
const Salesman = require('../models/Salesman.model');
const orangeHrmService = require('../services/orange-hrm-service');
const kafkaService = require('../services/kafka-service');

exports.create = async function(req, res) {
    try {
        // create bonusComputation
        const bonusComputation = new BonusComputation({
            sid: req.body.sid,
            year: req.body.year,
            value: req.body.value,
            performanceRecords: req.body.performanceRecords,
            salesOrders: req.body.salesOrders,
            remarks: req.body.remarks,
            status: req.body.status
        });
        // save bonusComputation in database
        const data = await bonusComputation.save();
        // post bonusComputation to OrangeHRM
        const employeeId = await Salesman.findById(req.body.sid, 'employeeId');
        await orangeHrmService.postBonusComputation(employeeId.employeeId, req.body.year, req.body.value);
        await kafkaService.runProducer(kafkaService.createLogFromBonusComputation(bonusComputation._id, 'created'));
        res.send(data);
    }
    catch (err){
        res.status(500).send({
            message: err || 'There was a problem creating the bonus computation!'
        })
    }
};

exports.findBySidAndYear = async function(req, res) {
    try {
        const bonusComputation = await BonusComputation.find({sid: req.params.sid, year: req.params.year});
        if(!bonusComputation) {
            return res.status(404).send({message: "Bonus Computation not found!"});
        }
        await kafkaService.runProducer(kafkaService.createLogFromBonusComputation(bonusComputation[0]._id, 'retrieved'));
        console.log(bonusComputation);
        console.log(typeof bonusComputation);
        res.send(bonusComputation);
    }
    catch(err) {
        return res.status(400).send({message: err.message});
    }
};

exports.update = async function(req, res) {
    try {
        const bonusComputation = await BonusComputation.findByIdAndUpdate(req.params._id, {
            sid: req.body.sid,
            year: req.body.year,
            value: req.body.value,
            performanceRecords: req.body.performanceRecords,
            salesOrders: req.body.salesOrders,
            remarks: req.body.remarks,
            status: req.body.status
        }, {new: true});
        await kafkaService.runProducer(kafkaService.createLogFromBonusComputation(bonusComputation._id, 'updated'));
        res.send(bonusComputation);
    }
    catch (err) {
        res.status(500).send({
            message: err
        });
    }
};
