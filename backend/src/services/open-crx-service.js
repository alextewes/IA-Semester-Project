const axios = require('axios');

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
async function fetchCustomers() {
    const contacts = await axios.get(`${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account`, config);
    const customers = contacts.data.objects;
    //console.log(customers)
    return customers;
}

async function fetchSalesOrders() {
    const sales = await axios.get(`${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder`, config)
    const salesorders = sales.data.objects;
    return salesorders;
}



