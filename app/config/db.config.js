module.exports = {
  HOST: "localhost",
  USER: "zi",
  PASSWORD: "zimnb",
  DB: "karmaBooks",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};