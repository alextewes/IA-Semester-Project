const Salesman = require('../models/Salesman.model.js')


exports.create = async function(req, res) {
    try {
        // create salesman
        const salesman = new Salesman({
            sid: req.body.sid,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dob: req.body.dob,
            experience: req.body.experience
        });
        // save salesman in database
        const data = await salesman.save();
        res.send(data);
    }
    catch (err){
        res.status(500).send({
            message: err || 'There was a problem creating the salesman!'
        })
    }
};

exports.findBySid = async function(req, res) {
    try {
        const salesman = await Salesman.findOne({sid: req.params.sid});
        if(!salesman) {
            return res.status(404).send({message: "Salesman not found!"});
        }
        res.send(salesman);
    }
    catch(err) {
        return res.status(400).send({message: err.message});
    }
}

exports.findAll = async function(req, res) {
    try {
        const salesman = await Salesman.find();
        res.send(salesman);
    }
    catch (err) {
        err.send({message: err});
    }
};

exports.update = async function(req, res) {
    try {
        const salesman = await Salesman.findOneAndUpdate({sid: req.params.sid}, {
            sid: req.body.sid,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dob: req.body.dob,
            experience: req.body.experience
        }, {new: true});
        res.send(salesman);
    }
    catch (err) {
        return res.status(500).send({
            message: err
        });
    }
};

exports.delete = async function(req, res) {
    try {
        const salesman = await Salesman.findOneAndDelete({prid: req.params.prid});
        if(!salesman) {
            return res.status(404).send({
                message: "Salesman not found with sid: " + req.params.prid
            });
        }
        res.send({message: "Salesman deleted!"});
    }
    catch (err) {
        return res.status(500).send({
            message: err
        });
    }
};