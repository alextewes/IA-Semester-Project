
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
router.get('/salesman/:sid', salesmanApi.findBySid);
router.get('/find-all', salesmanApi.findAll);
router.put('/salesman/:sid', salesmanApi.update);


module.exports = router;
