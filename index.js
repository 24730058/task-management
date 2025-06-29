const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

// Import and connect to the database
const database = require('./config/database');
database.connect();

// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json());

const routeClient = require("./api/v1/routes/client/index.route");
routeClient(app);


app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
})