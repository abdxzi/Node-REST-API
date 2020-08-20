module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("book", {
    book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey:true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.STRING
    },
    author_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
    },{
      timestamps: false
    });

  return Book;
};