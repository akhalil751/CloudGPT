
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const { registerUser, loginUser } = require('./handler');

const app = express();
const router = express.Router();

app.use(bodyParser.json());

// login and signup
router.post('/register', registerUser);
router.post('/login', loginUser);

app.use('/.netlify/functions/app', router);  // For Netlify deployment

module.exports.handler = serverless(app);
