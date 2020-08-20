const db = require("../models");

const Author = db.authors;
const Review = db.reviews;
const Book = db.books;


const Op = db.Sequelize.Op;


// Create and Save a new Book 
exports.createBook = (req, res) => {

    // Validate request
    if (!req.body.title || !req.body.author) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    } else {

        // check whether book eist or not
        Book.count({ where : {title : req.body.title}})
        .then(count => {
            if (count > 0) {res.status(500).send({message: "Already Exists"});return;}
        });

        function authCheck(){
            return new Promise(resolve => {
                // check whether author exist or not and return author_id
                Author.count({ where : {name : req.body.author}})
                .then(count => {
                    if (count > 0){
                        // Author exists then retreive author id
                        Author.findAll({ where : {name : req.body.author}}).then(data => {
                            resolve(data[0].author_id);

                        })
                    } else {
                        // if author does not exist, Add author to database
                        const author = {
                            name : req.body.author
                        };
                
                        Author.create(author)
                        .then(data => {
                            resolve(data.author_id);
                        })
                        .catch(err => {
                            res.status(500).send({
                                message:
                                err.message || "Error occurred while creating the Tutorial."
                            });
                            return;
                        });           
                    }
                });
            });
        }
        
        async function bookIdCheck(){
            const book = {
                title: req.body.title,
                description: req.body.description,
                author_id: await authCheck()
            };

            Book.create(book)
            .then(data => {

                // Add review
                const review = {
                    review: req.body.review,
                    book_id: data.book_id
                };
                Review.create(review)
                .then(data => {
                    res.status(200).send({message : "Book added succesfuly"});
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                        err.message || "Error occurred while creating the Book."
                    });
                    return;
                });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Error occurred while creating the book."
                });
                return;
            });
        }
        bookIdCheck();
    }
};

// Retrieve all Books from the database.
exports.findAllBooks = (req, res) => {
    const gid = req.query.authorID;
    var condition = gid ? { author_id: { [Op.like]: `%${gid}%` } } : null;

    Book.findAll({ where: condition })
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving books."
        });
    });
};


// Find a single Tutorial with an id
exports.findOneBook = (req, res) => {
    const gid = req.params.id;
   
    Book.findAll({where : {book_id : gid}, include : [Author,Review]})
    .then(data => {
        res.status(200).send(data[0]);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Book with id=" + gid
        });
        return;
    });
};

// Update a Tutorial by the id in the request 
exports.updateBook = (req, res) => {
    const gid = req.params.id;
    
    if (!req.body.title || !req.body.description) {
        res.status(500).send({
            message: "Content cant be empty"
        });
        return;
    }

    const upd = {
        title : req.body.title,
        description : req.body.description
    };

    Book.update(upd, {where: { book_id: gid }})
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Book was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Book with id=${gid}. Maybe Book was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Book with id=" + gid
        });
    });
};

// Delete a Tutorial with the specified id in the request
exports.deleteBook = (req, res) => {
    const id = req.params.id;
  
    Book.destroy({ where: { book_id: id } })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Book deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Book with id=${id}. Maybe Book was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Book with id=" + id
        });
    });
};


// AUTHOR API PART --------------------------------------------------------

exports.createAuthor = (req, res) => {
    // Validate request
    if (!req.body.author) {
        res.status(500).send({message: "Content can not be empty!"});
        return;
    } else {
        // if author does not exist, Add author to database
        const author = {
            name : req.body.author
        };

        Author.create(author)
        .then(data => {
            res.status(200).send(data);return;
        })
        .catch(err => {
            if (err.name == 'SequelizeUniqueConstraintError') {res.status(500).send({message:"Already Exists"});return;}
            res.status(500).send({
                message:
                err.message || "Error occurred while creating the Author."
            });
            return;
        });           
    }
};

exports.findAllAuthors = (req, res) => {
        Author.findAll({include : [Book]})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                message: err.message || "Some error occurred while retrieving authors."
            });
        });
};

exports.findOneAuthor = (req, res) => {
    const gid = req.params.id;
   
    Author.findAll({where : {author_id : gid}, include : Book})
    .then(data => {
        res.status(200).send(data[0]);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Author with id=" + gid
        });
        return;
    });
};

exports.updateAuthor = (req, res) => {
    const gid = req.params.id;
    
    if (!req.body.author) {
        res.status(500).send({
            message: "Content cant be empty"
        });
        return;
    }

    const upd = {
        name: req.body.author
    };

    Author.update(upd, {where: { author_id: gid }})
    .then(num => {

        if (num == 1) {
            res.send({
                message: "Author was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Author with id=${gid}. Maybe Author was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        if (err.name == 'SequelizeUniqueConstraintError') {res.status(500).send({message:req.body.author+" already Exists"});return;}
        res.status(500).send({
            message: "Error updating Author with id=" + gid
        });
    });
};

exports.deleteAuthor = (req, res) => {
    const gid = req.params.id;
  
    Author.destroy({ where: { author_id: gid } })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Author and Books deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Author with id=${gid}. Maybe Author was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Author with id=" + gid
        });
    });
};



// REVIEW API PART 

exports.createReview = (req, res) => {
    // Validate request
    if (!req.body.review || !req.body.bookID) {
        res.status(500).send({message: "Content can not be empty!"});
        return;
    } else {
        const rev = {
            book_id : req.body.bookID,
            review : req.body.review
        };

        Review.create(rev)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            if (err.name == 'SequelizeForeignKeyConstraintError'){res.status(500).send({message:'Book with id:'+req.body.bookID+' not found'});return;}
            res.status(500).send({
                message: "Error occurred while creating the Review."
            });
            return;
        });           
    }
};

exports.findAllReviews = (req, res) => {

    const gid = req.query.bookID;
    var condition = gid ? { book_id: { [Op.like]: `%${gid}%` } } : null;

    Review.findAll({ where: condition })
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving reviews."
        });
    });
};

exports.findOneReview = (req, res) => {
    const gid = req.params.id;

    Review.findAll({where : {id : gid}, include : Book})
    .then(data => {
        res.status(200).send(data[0]);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving review with id=" + gid
        });
        return;
    });
};

exports.updateReview = (req, res) => {
    const gid = req.params.id;
    
    if (!req.body.review) {
        res.status(500).send({
            message: "Content cant be empty"
        });
        return;
    }

    const upd = {
        review: req.body.review
    };

    Review.update(upd, {where: { id: gid }})
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Review was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Review with id=${gid}. Maybe Review was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Author with id=" + gid
        });
    });
};

exports.deleteReview = (req, res) => {
    const gid = req.params.id;
  
    Review.destroy({ where: { id: gid } })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Review deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Review with id=${gid}. Maybe Revieew was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Review with id=" + gid
        });
    });
};