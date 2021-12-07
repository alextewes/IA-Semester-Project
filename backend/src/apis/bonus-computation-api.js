const BonusComputation = require('../models/BonusComputation.model');
const Salesman = require('../models/Salesman.model');
const orangeHrmService = require('../services/orange-hrm-service');

exports.create = async function(req, res) {
    try {
        // create bonusComputation
        const bcid = new Date().valueOf();
        const bonusComputation = new BonusComputation({
            bcid: bcid,
            sid: req.body.sid,
            year: req.body.year,
            value: req.body.value,
            salesorders: req.body.salesorders,
            performanceRecords: req.body.performanceRecords
        });
        // save bonusComputation in database
        const data = await bonusComputation.save();
        // post bonusComputation to OrangeHRM
        const employeeId = await Salesman.findById(req.body.sid, 'employeeId');
        await orangeHrmService.postBonusComputation(employeeId.employeeId, req.body.year, req.body.value);
        res.send(data);
    }
    catch (err){
        res.status(500).send({
            message: err || 'There was a problem creating the bonus computation!'
        })
    }
};
