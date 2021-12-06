const axios = require('axios');
const qs = require('querystring');
const Salesman = require('../models/Salesman.model')
const baseUrl = 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php';

let accessToken = null;
const body = qs.stringify({
    client_id: 'api_oauth_id',
    client_secret: 'oauth_secret',
    grant_type: 'password',
    username: 'demouser',
    password: '*Safb02da42Demo$'
});
const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    }
};

getOrangeHrmToken = async () => {
    const res = await axios.post(`${baseUrl}/oauth/issueToken`, body, config);
    if (res.data.error) {
        throw Error(res.data.error);
    }
    accessToken = res.data['access_token'];
    return accessToken;
}

exports.getAllEmployees = async () => {
    try {
        let token = await getOrangeHrmToken()
        let config = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        };
        const accounts = await axios.get('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search', config);
        const unfilteredAccounts = accounts.data.data;
        console.log(unfilteredAccounts);
        let employees = [];
        for(let e of unfilteredAccounts) {
            const sid = e.code;
            const firstName = e.firstName;
            const lastName = e.lastName;
            const dob = e.dob;
            const department = e.unit;
            let employee = new Salesman({sid: sid, firstName: firstName,lastName :lastName, dob: dob, department:department});
            await employee.save();
            employees.push(employee);
        }
        return employees;
    }
    catch(e) {
        console.log(e);
    }

}
