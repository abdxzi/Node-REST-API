module.exports = (sequelize, Sequelize) => {
  const Author = sequelize.define("author", {
    author_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement:true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique:true
    }
  },{
    timestamps: false
  });

  return Author;
};