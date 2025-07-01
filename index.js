const express = require('express');
var cors = require('cors')
require('dotenv').config();
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
// Import and connect to the database
const database = require('./config/database');
database.connect();

// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000;

// // Tất cả tên miền được phép truy cập vào
app.use(cors());

// Cho phép 1 tên miền cụ thể được phép truy cập
// const corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200
// }
// cors(corsOptions);
// parse application/json
app.use(bodyParser.json());

// cookieParser
app.use(cookieParser())

const routeClient = require("./api/v1/routes/client/index.route");
routeClient(app);


app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
})