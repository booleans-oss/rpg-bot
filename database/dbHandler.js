const db = require('../database/database');
const database = db.get('user');

async function isUser(id) {
    let user = await database.findOne({userId: id})
    return user !== null
}
async function findConnection(id) {
    let connection = await database.findOne({connexion: id});
    return connection !== null
}
async function findUser(id) {
    let user = await database.findOne({userId: id});
    return user;
}
async function isTokenConnected(token) {
    let user = await database.findOne({_id: token});
    return user !== null;
}
async function findUserViaConnexion(id) {
    let user = await database.findOne({connexion: id});
    return user;
}
async function findViaToken(token) {
    let user = await database.findOne({_id: token});
    return user
}
module.exports = {
    isUser, findConnection, findUser, findUserViaConnexion, isTokenConnected, findViaToken
}