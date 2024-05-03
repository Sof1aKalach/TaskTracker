const bodyParser = require('body-parser')
var cors = require('cors')
const express = require("express");
const { connect, disconnect } = require('./infrastructure/mongodb');

const app = express();
app.use(cors())

// create application/json parser
var jsonParser = bodyParser.json()
app.use(jsonParser)

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser)

app.get("/health", (req, res) => {
    res.send("<h1>Service is OK!</h1>");
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use("/task", require("./routes/task"));
app.use("/category", require("./routes/category"));

app.listen(3001, async () => {
    await connect()
});

process.on('exit', function () {
    disconnect()
}); 