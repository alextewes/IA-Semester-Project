const axios = require('axios');
const qs = require('querystring');
const FormData = require('form-data');
const Salesman = require('../models/Salesman.model')
const baseUrl = 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php';
const kafkaService = require("../services/kafka-service");

let accessToken = null;
const body = qs.stringify({
    client_id: 'api_oauth_id',
    client_secret: 'oauth_secret',
    grant_type: 'password',
    username: 'Tewes',
    password: 'UptG8qc-PlKRTqNt3j6_xcewbyUE9pYMx6GK'
});
const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    }
};

const getOrangeHrmToken = async function() {
    const res = await axios.post(`${baseUrl}/oauth/issueToken`, body, config);
    if (res.data.error) {
        throw Error(res.data.error);
    }
    accessToken = res.data['access_token'];
    return accessToken;
}

const createSalesmen = async function() {
    try {
        const token = await getOrangeHrmToken();
        let config = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        };
        const accounts = await axios.get('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search', config);
        await kafkaService.runProducer("Connection to OrangeHRM established.");
        const unfilteredAccounts = accounts.data.data;
        for(let e of unfilteredAccounts) {
            if(e.unit === "Sales") {
                const sid = e.code;
                const employeeId = e.employeeId;
                const firstName = e.firstName;
                const lastName = e.lastName;
                const dob = e.dob;
                const department = e.unit;
                const query = {
                    _id: sid,
                    employeeId: employeeId,
                    firstName: firstName,
                    lastName :lastName,
                    dob: dob,
                    department:department
                };
                if(await Salesman.exists({_id: sid})) {
                    await Salesman.findByIdAndUpdate(sid);
                }
                else {
                    await new Salesman(query).save();
                }
            }
        }
    }
    catch(e) {
        console.log(e);
    }
}

const postBonusComputation = async function(id, year, value) {
    const token = await getOrangeHrmToken();
    let data = new FormData();
    data.append('year', year.toString());
    data.append('value', value.toString());
    let config = {
        method: 'post',
        url: `${baseUrl}/api/v1/employee/${id}/bonussalary`,
        headers: {
            'Authorization': 'Bearer ' + token,
            ...data.getHeaders()
        },
        data : data
    };
    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}

module.exports = {
    getOrangeHrmToken,
    createSalesmen,
    postBonusComputation
};