const express = require('express');
const router = express.Router();
const {checkAuthorization} = require('../middlewares/auth-middleware');

/*
    In this file the routing for the REST-endpoints under /api is managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login', checkAuthorization(),authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);

const salesmanApi = require('../apis/salesman-api');
router.post('/salesman', salesmanApi.create);
router.get('/salesman/:sid', salesmanApi.findById);
router.get('/salesman', salesmanApi.findAll);
router.put('/salesman/:sid', salesmanApi.update);
router.delete('/salesman/:sid', salesmanApi.delete);

const performanceRecordApi = require('../apis/performance-record-api');
router.post('/performance-record', performanceRecordApi.create);
router.get('/performance-record/:sid', performanceRecordApi.findBySid);
router.get('/performance-record', performanceRecordApi.findAll);
router.put('/performance-record/:_id', performanceRecordApi.update);
router.delete('/performance-record/:_id', performanceRecordApi.delete);

const bonusComputationApi = require('../apis/bonus-computation-api');
router.post('/bonus-computation', bonusComputationApi.create);
router.get('/bonus-computation/:sid/:year', bonusComputationApi.findBySidAndYear);

const salesorderApi = require('../apis/salesorder-api');
router.post('/salesorder', salesorderApi.create);
router.get('/salesorder', salesorderApi.findBySidAndYear);

module.exports = router;
