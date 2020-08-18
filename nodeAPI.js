/*
 * A Simple REST API (NodeJs + MySQL)
 * Coded By : @zix00
 * Project Karma
 * 
 * Database : karmaBooks --> kbooks [id, boook, author, review]
 * 
 * API VALUES : listBooks, /books/:id, /addBook, 
 */

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

// checking connection
con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
});

// return all Books with /listBooks
app.get('/listBooks', function (req, res) {
    con.query('SELECT * FROM karmaBooks.kbooks', (err,rows) => {
        if(err){
            console.log('Error on quering..')
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

// Details of specific book by id
app.get('/books/:id', function (req, res) {
    con.query(`SELECT * FROM karmaBooks.kbooks WHERE id=${con.escape(req.params.id)}`, (err,rows) => {
        if(err){
            console.log('Error in DB');
            res.status(424).send(JSON.parse('{"code": 424}'));
            return;
        } else {
            if (rows && rows.length) {
                var data = '"'+rows[0].id+'":{"name":"'+rows[0].book+'","author":"'+rows[0].author+'", "review":'+rows[0].review+'}';
                res.send(JSON.parse('{'+data+'}'));
            } else {
                res.status(404).send(JSON.parse('{"code":404}'));
            }
        }
    });
 });

// add Books
app.put('/addBook', function (req, res) {
    const book = req.body; // name, author, reviews
    console.log(book.name);
    var review="["+book.review+"]";
    if(book.review == undefined || book.name == undefined || book.author == undefined) {
        res.status(424).send(JSON.parse('{"code": 424}'));
    } else {
        
        con.query(`SELECT * FROM karmaBooks.kbooks WHERE book=${con.escape(book.name)}`, (err,rows) => {
            if(err){
                console.log('Error in DB');
                res.status(424).send(JSON.parse('{"code": 424}'));
                console.log(`SELECT * FROM karmaBooks.kbooks WHERE name=${con.escape(book.name)}`);
                throw err;
                return;
            } else {
                if (rows && rows.length) {
                    res.status(424).send(JSON.parse('{"code": 424}'));
                } else {
                    con.query(`INSERT INTO karmaBooks.kbooks (book, author, review) VALUES (${con.escape(book.name)},${con.escape(book.author)},${con.escape(review)})`, (err,result) => {
                        // console.log(`INSERT INTO karmaBooks.kbooks (book, author, review) VALUES (${con.escape(book.name)},${con.escape(book.author)},${con.escape(review)})`);
                        if(err){
                            console.log('Error on adding entry');
                            res.status(424).send(JSON.parse('{"code": 424}'));
                        } else {
                            res.status(200).send(JSON.parse('{"code":200,"id":"'+result.insertId+'"}'));
                        }
                    });
                }
            }
        });

    }
});

// Delete book
app.delete('/deleteBook/:id', function (req, res) {
    
    con.query(`SELECT * FROM karmaBooks.kbooks WHERE id=${con.escape(req.params.id)}`, (err,rows) => {
        if(err){
            console.log('Error in DB');
            res.status(424).send(JSON.parse('{"code": 424}'));
            return;
        } else {
            if (rows && rows.length) {
                con.query(`DELETE FROM karmaBooks.kbooks WHERE id=${con.escape(req.params.id)}`, (err,rows) => {
                    if(err){
                        console.log('Error in DB');
                        res.status(424).send(JSON.parse('{"code": 424}'));
                        return;
                    } else {
                       console.log('Done deletion');
                       res.status(200).send(JSON.parse('{"code":200}'));
                    }
                });
            } else {
                res.status(404).send(JSON.parse('{"code":404}'));
            }
        }
    });
    
    
});

// Addreviews : id, review
app.post('/addReview', function (req, res) {
    console.log(req.body);
    con.query(`SELECT * FROM karmaBooks.kbooks WHERE id=${con.escape(req.body.id)}`, (err,rows) => {
        if(err){
            console.log('Error in DB');
            res.status(424).send(JSON.parse('{"code": 424}'));
            return;
        } else {
            if (rows && rows.length) {
                var data = JSON.parse('{"rev":'+rows[0].review+'}');
                console.log("Taking data to JSON");
                console.log(data);
                data.rev.push(req.body.review);
                console.log(data);
                data = JSON.stringify(data).replace('{"rev":','').replace('}','');
                console.log(data);

                con.query(`UPDATE karmaBooks.kbooks SET review=${con.escape(data)} WHERE id=${con.escape(req.body.id)}`, (err,rows) => {
                    if(err){
                        console.log('Error in DB');
                        res.status(424).send(JSON.parse('{"code": 424}'));
                        return;
                    } else {
                        console.log('Database Updated');
                        res.status(200).send(JSON.parse('{"code":200}'));
                    }
                });
            } else {
                res.status(404).send(JSON.parse('{"code":404}'));
            }
        }
    });
});

/*
// edit a specific book
app.post('/addBook', function (req, res) {
    console.log(req.body); // id , property, 
    con.query(`SELECT * FROM karmaBooks.kbooks WHERE id=${con.escape(req.body.id)}`, (err,rows) => {
        if(err){
            console.log('Error in DB');
            res.status(424).send(JSON.parse('{"code": 424}'));
            return;
        } else {
            if (rows && rows.length) {
                var data = JSON.parse('{"rev":'+rows[0].review+'}');
                console.log("Taking data to JSON");
                console.log(data);
                data.rev.push(req.body.review);
                console.log(data);
                data = JSON.stringify(data).replace('{"rev":','').replace('}','');
                console.log(data);

                con.query(`UPDATE karmaBooks.kbooks SET review=${con.escape(data)} WHERE id=${con.escape(req.body.id)}`, (err,rows) => {
                    if(err){
                        console.log('Error in DB');
                        res.status(424).send(JSON.parse('{"code": 424}'));
                        return;
                    } else {
                        console.log('Database Updated');
                        res.status(200).send(JSON.parse('{"code":200}'));
                    }
                });
            } else {
                res.status(404).send(JSON.parse('{"code":404}'));
            }
        }
    });
});
*/

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});