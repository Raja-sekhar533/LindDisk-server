const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
require('dotenv').config({ path: './production.env' });
const http = require('http');
const https = require('https');
const fs = require('fs');
// const socketio = require('socket.io')
// const socketEvents = require('./chat/chat');
// const { Server } = require ('socket.io');

// const error = require('./common/error');

/*------------Database connection----------*/
mongoose
    .connect(process.env.MONGO_URI)
    .then((result) => {
        console.log("Mongodb Database is connected...");
    })
    .catch((err) => {
        console.log("Database is not connected...", err.message);
    });
/*------------Database connection----------*/



const app = express();
app.use(morgan("combined"));

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS, PATCH");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Authorization, Accept"
    );
    next();
});
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    })
);

var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/linedisk.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/linedisk.com/fullchain.pem'),
};


app.set("port", PORT)
app.use("/uploads", express.static("uploads"));

require("./router")(app);


app.get('/', (req, res) => {
    res.send('hello world')
})
var server = https.createServer(options, app).listen(process.env.PORT || 4000, function() {
    console.log("Express server listening on port %d in %s mode", PORT);
});

// app.listen(process.env.PORT || 4000, () => {
//     console.log("Express server listening on port %d in %s mode", PORT);
// });