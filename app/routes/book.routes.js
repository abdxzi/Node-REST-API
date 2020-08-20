module.exports = app => {
  const controller = require("../controllers/book.controller.js");

  var router = require("express").Router();

  // /api/book
  router.post("/book", controller.createBook);

  router.get("/book", controller.findAllBooks);

  router.get("/book/:id", controller.findOneBook);

  router.put("/book/:id", controller.updateBook);

  router.delete("/book/:id", controller.deleteBook);

  // /api/author
  router.post("/author", controller.createAuthor);

  router.get("/author", controller.findAllAuthors);

  router.get("/author/:id", controller.findOneAuthor);

  router.put("/author/:id", controller.updateAuthor);

  router.delete("/author/:id", controller.deleteAuthor);

  // /api/review
  router.post("/review", controller.createReview);

  router.get("/review", controller.findAllReviews);

  router.get("/review/:id", controller.findOneReview);

  router.put("/review/:id", controller.updateReview);

  router.delete("/review/:id", controller.deleteReview);


  app.use('/api', router);
};