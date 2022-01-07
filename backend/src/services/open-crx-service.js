const axios = require('axios');
const Salesorder = require("../models/Salesorder.model")
const mongoose = require("mongoose");

const baseUrl = 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX';
const credentials = {
    username: 'guest',
    password: 'guest',
};

const config = {
    headers: {
        'Accept': 'application/json'
    },
    auth: credentials,
};

async function fetchSalesOrders() {
    try {
        const sales = await axios.get(`${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder`, config)
        return sales.data.objects;
    }
    catch(e) {
        console.log(e);
    }
}

const createSalesOrders = async function() {
    try {
        const salesorders = await fetchSalesOrders();
        for(const salesorder of salesorders) {
            const salesRep = await axios.get(salesorder.salesRep['@href'], config);
            const customer = await axios.get(salesorder.customer['@href'], config);
            const positionResponse = await axios.get(salesorder['@href'] + '/position', config);
            if(positionResponse.data.objects !== undefined) {
                const position = positionResponse.data.objects[0];
                const id = mongoose.Types.ObjectId(salesorder['@href'].split('/').pop().slice(0,12));
                const sid = salesRep.data.governmentId;
                const year = parseInt(salesorder.createdAt.slice(0, 4));
                const product = position.productDescription === "Hoover for big companies" ? "HooverGo" : "HooverClean";
                const customerName = customer.data.fullName;
                const clientRanking = mapClientRanking(customer.data.accountRating);
                const items = parseInt(position.quantity);
                const bonus = 0;
                const query = {
                    _id: id,
                    sid: sid,
                    year: year,
                    product: product,
                    customerName: customerName,
                    clientRanking: clientRanking,
                    items: items,
                    bonus: bonus
                }
                if(await Salesorder.exists({_id: id})) {
                    await Salesorder.findByIdAndUpdate(id, query);
                }
                else {
                    await new Salesorder(query).save();
                }
            }
        }
    }
    catch(e) {
        console.log(e);
    }
}

const mapClientRanking = function(clientRanking) {
    return clientRanking === 1 ? 'good' : clientRanking === 2 ? 'very good' : 'excellent';
}

module.exports = {
    createSalesOrders
}




