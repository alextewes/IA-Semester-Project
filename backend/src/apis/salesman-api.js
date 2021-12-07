const Salesman = require('../models/Salesman.model.js')

exports.create = async function(req, res) {
    try {
        // create salesman
        const id = new Date().valueOf();
        const salesman = new Salesman({
            _id: id,
            employeeId: req.body.employeeId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dob: req.body.dob,
            department: req.body.department
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

exports.findById = async function(req, res) {
    try {
        const salesman = await Salesman.findById(req.params.id);
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
        const salesman = await Salesman.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dob: req.body.dob,
            department: req.body.department
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
        const salesman = await Salesman.findByIdAndDelete(req.params.id);
        if(!salesman) {
            return res.status(404).send({
                message: "Salesman not found with ID: " + req.params.id
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