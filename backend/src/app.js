/*
    This file acts as the entrypoint for node.js
 */

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const orangeHrmService = require('./services/orange-hrm-service');
const openCrxService = require('./services/open-crx-service');


const multer = require('multer');
const upload = multer();
const app = express();
const crypto = require('crypto');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// MongoDB connection details:
const domain = 'localhost';
const port = '27017';
const username = '';
const password = '';
const databaseName = 'intArch';

app.use(express.json()); //adds support for json encoded bodies
app.use(express.urlencoded({extended: true})); //adds support url encoded bodies
app.use(upload.array()); //adds support multipart/form-data bodies

app.use(session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}));

const apiRouter = require('./routes/api-routes');
const userService = require("./services/user-service");
const User = require("./models/User"); //get api-router from routes/api
app.use('/api', apiRouter); //mount api-router at path "/api"
// !!!! attention all middlewares, mounted after the router wont be called for any requests

//preparing database credentials for establishing the connection:
let credentials = '';
if(username){
    credentials = username+':'+password+'@';
}
mongoose.connect('mongodb://' + credentials + domain + ':' + port + '/' + databaseName);

MongoClient.connect('mongodb://' + credentials + domain + ':' + port + '/').then(async dbo =>{ //connect to MongoDb

    const db = dbo.db(databaseName);
    await initDb(db); //run initialization function
    await initStandardUsers(db);
    app.set('db',db); //register database in the express app

    app.listen(8080, () => { //start webserver, after database-connection was established
        console.log('Webserver started.');
    });
});

const getRandomPassword = () => crypto.randomBytes(8).toString('base64');

async function initDb(db){
    if(await db.collection('users').count() < 1){ //if no user exists create admin user
        const userService = require('./services/user-service');
        const User = require("./models/User");

        const adminPassword = getRandomPassword();
        await userService.add(db, new User('admin', '', 'admin', '', adminPassword, true, 0));

        console.log('created admin user with password: '+adminPassword);
    }
}

async function initStandardUsers(db){
    if(await db.collection('users').count() < 4){ //if no user exists create admin user
        const userService = require('./services/user-service');
        const User = require("./models/User");

        const randomPasswords = [getRandomPassword(), getRandomPassword(), getRandomPassword()];
        const usernames = ['ceo', 'hr', 'salesman'];
        await userService.add(db, new User(usernames[0], 'Michael', 'Moore', '', randomPasswords[0], false, 1));
        await userService.add(db, new User(usernames[1], 'Chantal', 'Banks', '', randomPasswords[1], false, 2));
        await userService.add(db, new User(usernames[2], 'John', 'Smith', '', randomPasswords[2], false, 3));

        for(let i = 0; i < 3; ++i) {
            console.log(`created ${usernames[i]} with password: ${randomPasswords[i]}`);
        }
    }
}

orangeHrmService.createSalesmen().then(r => console.log("Salesmen updated!")).catch(err => console.log(err));
openCrxService.createSalesOrders().then(r => console.log("Salesorders updated!")).catch(err => console.log(err));
