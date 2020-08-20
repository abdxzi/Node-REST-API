module.exports = (sequelize, Sequelize) => {
  const Review = sequelize.define("review", {
    id: {
      type: Sequelize.INTEGER,
      allowNull:false,
      primaryKey: true,
      autoIncrement: true
    },
    review: {
      type: Sequelize.STRING
    },
    book_id: {
      type: Sequelize.INTEGER,
      allowNull:false,
    }
  },{
    timestamps: false
  });

  return Review;
};