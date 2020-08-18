/*
 * A Simple REST API (NodeJs + MySQL)
 * Coded By : @zix00
 * created for Project Karma
 * 
 * Database : karmaBooks --> kbooks [id, boook, author, review]
 */


// importing required modules
var express = require('express');
var app = express();

var mysql = require('mysql');
const bodyParser = require('body-parser');

// Configuring body parser middleware to parse req body to json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create connection to MySQL Server
var con = mysql.createConnection({
    host: "localhost",
    user: "zi",
    password: "zimnb"
});

// checking database connection
con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Database Connection established');
});

/* /listBooks */
app.get('/api/listBooks', function (req, res) {
    con.query('SELECT * FROM karmaBooks.kbooks', (err,rows) => {
        if(err){
            res.status(424).send(JSON.parse('{"code": 424,"err":"error connecting DB"}'));
        } else {
            var data = "", count=1;
            rows.forEach( (row) => {
                data += '"'+row.id+'":{"name":"'+row.book+'","author":"'+row.author+'", "review":'+row.review+'}';
                if (count<rows.length) {data+=',';}
                count++;
            });
            res.send(JSON.parse('{"books":{'+data+'}}'));
        }
    });
});

// Details of specific book by /book/:id
app.get('/api/book/:id', function (req, res) {
    con.query(`SELECT * FROM karmaBooks.kbooks WHERE id=${con.escape(req.params.id)}`, (err,rows) => {
        if(err){
            res.status(424).send(JSON.parse('{"code": 424,"err":"error quering DB"}'));
            return;
        } else {
            if (rows && rows.length) {
                var data = '"'+rows[0].id+'":{"name":"'+rows[0].book+'","author":"'+rows[0].author+'", "review":'+rows[0].review+'}';
                res.send(JSON.parse('{'+data+'}'));
            } else {
                res.status(404).send(JSON.parse('{"code":404,"err":"not found"}'));
            }
        }
    });
 });

// /addBook -- parameters: name, author, review
app.put('/api/addBook', function (req, res) {
    const book = req.body; 
    if(book.name == undefined || book.author == undefined) {
        res.status(424).send(JSON.parse('{"code": 424,"err":"invalid parameters"}'));
    } else {
        if (book.review == undefined){
            var review=`[]`;
        } else {
            var review=`[\"${book.review}\"]`;
        }
        

        // check book already exists
        con.query(`SELECT * FROM karmaBooks.kbooks WHERE book=${con.escape(book.name)}`, (err,rows) => {
            if(err){
                res.status(424).send(JSON.parse('{"code": 424,"err":"error quering DB"}'));
                return;
            } else {
                if (rows && rows.length) {
                    res.status(424).send(JSON.parse('{"code": 424,"err":"already exists"}'));
                } else {

                    // insert data into database
                    con.query(`INSERT INTO karmaBooks.kbooks (book, author, review) VALUES (${con.escape(book.name)},${con.escape(book.author)},${con.escape(review)})`, (err,result) => {
                        if(err){
                            res.status(424).send(JSON.parse('{"code": 424,"err":"error quering DB"}'));
                        } else {
                            res.status(200).send(JSON.parse('{"code":200,"id":"'+result.insertId+'"}'));
                        }
                    });
                }
            }
        });

    }
});

// /deleteBook/:id
app.delete('/api/deleteBook/:id', function (req, res) {

    // check book exists or not
    con.query(`SELECT * FROM karmaBooks.kbooks WHERE id=${con.escape(req.params.id)}`, (err,rows) => {
        if(err){
            res.status(424).send(JSON.parse('{"code": 424,"err":"error quering DB"}'));
            return;
        } else {
            if (rows && rows.length) {

                // deleting records from database
                con.query(`DELETE FROM karmaBooks.kbooks WHERE id=${con.escape(req.params.id)}`, (err,rows) => {
                    if(err){
                        res.status(424).send(JSON.parse('{"code": 424,"error":"error quering DB"}'));
                        return;
                    } else {
                       res.status(200).send(JSON.parse('{"code":200}'));
                    }
                });
            } else {
                res.status(404).send(JSON.parse('{"code":404,"err":"not found"}'));
            }
        }
    });
    
    
});

// /Addreview -- parameters :: id, review
app.post('/api/addReview', function (req, res) {
    console.log(req.body.review);
    if (req.body.review == undefined || req.body.id == undefined){
        res.status(424).send(JSON.parse('{"code": 424, "err":"invalid parameters"}'));
    } else {

        // checks book exist or not
        con.query(`SELECT * FROM karmaBooks.kbooks WHERE id=${con.escape(req.body.id)}`, (err,rows) => {
            if(err){
                console.log('Error in DB');
                res.status(424).send(JSON.parse('{"code": 424,"err":"error quering database"}'));
                return;
            } else {
                if (rows && rows.length) {
                    var data = JSON.parse('{"rev":'+rows[0].review+'}');
                    data.rev.push(req.body.review);
                    data = JSON.stringify(data).replace('{"rev":','').replace('}','');
                    
                    // adds review to database
                    con.query(`UPDATE karmaBooks.kbooks SET review=${con.escape(data)} WHERE id=${con.escape(req.body.id)}`, (err,rows) => {
                        if(err){
                            res.status(424).send(JSON.parse('{"code": 424,"error quering database":""}'));
                            return;
                        } else {
                            res.status(200).send(JSON.parse('{"code":200}'));
                        }
                    });
                } else {
                    res.status(404).send(JSON.parse('{"code":404, "err":"not found"}'));
                }
            }
        });
    }
    
});


// /editBook parameters: id, property, newValue, reviewId(optional) property values : name,author,review
app.post('/api/editBook', function (req, res) {
    console.log(req.body); 

    if (req.body.id == undefined || req.body.property == undefined || req.body.newValue == undefined){
        res.status(424).send(JSON.parse('{"code": 424, "err":"invalid parameters"}'));
    } else {

        // checks book exists or not
        con.query(`SELECT * FROM karmaBooks.kbooks WHERE id=${con.escape(req.body.id)}`, (err,rows) => {
            if(err){
                res.status(424).send(JSON.parse('{"code": 424,"err":"error quering DB"}'));
                return;
            } else {
                if (rows && rows.length) {

                    // if propery is author of a book
                    if (req.body.property == 'author'){
                        con.query(`UPDATE karmaBooks.kbooks SET author=${con.escape(req.body.newValue)} WHERE id=${con.escape(req.body.id)}`, (err,rows) => {
                            if(err){
                                console.log('Error Quering DB');
                                res.status(424).send(JSON.parse('{"code": 424,"err":"error quering DB"}'));
                                return;
                            } else {
                                console.log('Database Updated');
                                res.status(200).send(JSON.parse('{"code":200}'));
                            }
                        });

                    // If property is name of book
                    } else if(req.body.property == 'name'){

                        // preventing name change to an existing name
                        con.query(`SELECT * FROM karmaBooks.kbooks WHERE book=${con.escape(req.body.newValue)}`, (err,rows) => {
                            if(err){
                                console.log('Error in DB');
                                res.status(424).send(JSON.parse('{"code": 424,"err":"error quering DB"}'));
                                return;
                            } else {
                                if (rows && rows.length) {
                                    res.status(424).send(JSON.parse('{"code": 424,"err":"already exists"}'));
                                } else {
                                    con.query(`UPDATE karmaBooks.kbooks SET author=${con.escape(req.body.newValue)} WHERE id=${con.escape(req.body.id)}`, (err,rows) => {
                                        if(err){
                                            console.log('Error Quering DB');
                                            res.status(424).send(JSON.parse('{"code": 424,"err":"error quering DB"}'));
                                            return;
                                        } else {
                                            console.log('Database Updated');
                                            res.status(200).send(JSON.parse('{"code":200}'));
                                        }
                                    });
                                }
                            }
                        });
                        
                    // If property if one of the review of a book
                    } else if(req.body.property == 'review') {
                        if (req.body.reviewId == undefined){
                            res.status(424).send(JSON.parse('{"code": 424, "err":"reviewId not found"}'));
                        } else {
                            var data = JSON.parse('{"rev":'+rows[0].review+'}');
                            console.log(data);
                            data.rev[req.body.reviewId] = req.body.newValue;
                            console.log(data);
                            
                            data = JSON.stringify(data).replace('{"rev":','').replace('}','');
                            console.log(data);
                            
                            con.query(`UPDATE karmaBooks.kbooks SET review=${con.escape(data)} WHERE id=${con.escape(req.body.id)}`, (err,rows) => {
                                if(err){
                                    console.log('Error in DB');
                                    res.status(424).send(JSON.parse('{"code": 424,"err":"error quering DB"}'));
                                    return;
                                } else {
                                    console.log('Database Updated');
                                    res.status(200).send(JSON.parse('{"code":200}'));
                                }
                            });

                        }
                    } else {
                        res.status(424).send(JSON.parse('{"code": 424, "err":"wrong property"}'));
                    }
                } else {
                    res.status(404).send(JSON.parse('{"code":404,"err":"not found"}'));
                }
            }
        });
    }
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});
