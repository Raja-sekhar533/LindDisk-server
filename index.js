const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
// const http = require('http');
// const socketio = require('socket.io')
// const socketEvents = require('./chat/chat');
// const { Server } = require ('socket.io');

// const error = require('./common/error');

/*------------Database connection----------*/
mongoose
    .connect("mongodb+srv://linedisk:linedisk@cluster0.8bimb.mongodb.net/LineDisk?retryWrites=true&w=majority")
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



app.set("port", PORT)
app.use("/uploads", express.static("uploads"));

require("./router")(app);


app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(process.env.PORT || 4000, () => {
    console.log("Express server listening on port %d in %s mode", PORT);
})