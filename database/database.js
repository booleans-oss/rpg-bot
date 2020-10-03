const monk = require("monk");
const db = monk(process.env.DB_STRING);

module.exports = db; 
