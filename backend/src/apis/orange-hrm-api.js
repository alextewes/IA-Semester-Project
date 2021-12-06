const userService = require('../services/user-service')
const authService = require('../services/auth-service');
const orangeHrmService = require('../services/orange-hrm-service');
const axios = require("axios");
const baseUrl = 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php';

const bearerToken = orangeHrmService.getOrangeHrmToken();

async function getEmployee(req,res){
    const id = req.params.employeeId;
    try {
        const result = await axios.get(`${baseUrl}/api/v1/employee/${id}`, await bearerToken);
        console.log(res.result.data);
        res.send(result.data);
    }
    catch (err) {
        res.status(404).send({
            message: err || 'There was a problem creating the performanceRecord!'
        })
    }
}

getEmployee()
