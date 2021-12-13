const Salesorder = require('../models/Salesorder.model');

exports.create = async function(req, res) {
    try {
        // create salesorder
        const salesorder = new Salesorder({
            sid: req.body.sid,
            year: req.body.year,
            product: req.body.product,
            customerName: req.body.customerName,
            clientRanking: req.body.clientRanking,
            items: req.body.items,
            bonus: req.body.bonus

        });
        // save bonusComputation in database
        const data = await salesorder.save();
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
        const salesorder = await Salesorder.find({sid: req.params.sid, year: req.params.year});
        if(!salesorder) {
            return res.status(404).send({message: "Salesorder not found!"});
        }
        res.send(salesorder);
    }
    catch(err) {
        return res.status(400).send({message: err.message});
    }
};