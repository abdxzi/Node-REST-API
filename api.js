/*
 * A Simple REST API (NodeJs + MySQL)
 * Coded By : @zix00
 * created for Project Karma
 * 
 * Database : karmaBooks -->    books [book_id, title, publish_date, author_id]
 *                              authors [id, name]
 *                              reviews [id, review, book_id]
 *                              -COMMING SOON-
 *                              users [user_id, fullname, address]
 *                              checkout [user_id, book_id,checkout_date,return_date]
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





/*
// connecting to database
const sequelize = new Sequelize('karmaBooks','zi','zimnb',{host:'localhost',port:'3306', dialect:'mysql'});

// checking db connection
sequelize.authenticate()
    .then(() => {console.log('Database connection established.')})
    .catch(err => {console.error(err);});






const User = sequelize.define('User', {
      // Model attributes are defined here
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING
        // allowNull defaults to true
      },
    },
    {
        tableName: 'users'
    });
    
    // `sequelize.define` also returns the model
    console.log(User === sequelize.models.User); // true

    sequelize.sync({ force: true })
    .then(() => {console.log('Synced')})
    .catch(err => {console.error(err);});





*/


















//sequelize.close();