/*
 * A Simple REST API (NodeJs + MySQL)
 * Coded By : @zix00
 * created for Project Karma
 * 
 *                              
 */


// importing required modules
var express = require('express');
var app = express();

//var mysql = require('mysql');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes, Model } = require('sequelize');

// Configuring body parser middleware to parse req body to json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./app/models");
db.sequelize.sync();

app.get("/", (req, res) => {
    res.json({ message: "Welcome to KarmaBooks Library" });
});

require("./app/routes/book.routes")(app);
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});

// sequelize.close();