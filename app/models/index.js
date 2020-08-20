const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});



const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.books = require("./book.model.js")(sequelize, Sequelize);
db.authors = require("./author.model.js")(sequelize, Sequelize);
db.reviews = require("./review.model.js")(sequelize, Sequelize);

// associations
db.authors.hasMany(db.books,{ foreignKey: 'author_id' },{ onDelete: 'cascade' });
db.books.hasMany(db.reviews, { foreignKey: 'book_id' },{ onDelete: 'cascade' });
db.books.belongsTo(db.authors,{ foreignKey: 'author_id' },{ onDelete: 'cascade' });

db.reviews.belongsTo(db.books, { foreignKey: 'book_id' });

module.exports = db;