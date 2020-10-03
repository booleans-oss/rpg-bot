const { Structures } = require('discord.js');
const { isUser, findConnection, findUserViaConnexion, isTokenConnected, findViaToken } = require('../database/dbHandler');
const { registry, connect } = require('../utils/assets/UserData');
const db = require('../database/database');
const database = db.get('user');
Structures.extend('User', (User) => {
    class CustomUser extends User {
        constructor(client, data) {
            super(client, data);
           
        }
        async insertIntoDatabase(message) {
            if(await isUser(this.id)) return message.channel.send("Vous êtes déjà dans la base de données.");
            await registry(this)
        }
        async disconnect() {
            if(await findConnection(this.id)) {
                this.send("Vous n'êtes pas connecté");
            }
            else {
                database.findOneAndUpdate({userId: this.id}, {$set: { connexion: "personne"} }).then(() => {
                    this.send("Vous vous êtes bien déconnecté de votre compte!")
                }).catch(e => console.log(e))
            }

        }
        async isConnected(token, message) {
            if(await findConnection(this.id)) {
                let user = await findUserViaConnexion(this.id);
                if(user.userId === this.id) return message.channel.send(`Vous êtes déjà connecté sur votre compte.`);
                else return message.channel.send(`Vous êtes déjà connecté sur le compte ${user.userPseudo}`)
            }
            if(await isTokenConnected(token)) {
                let user  = await findViaToken(token);
                if(user.connexion === "personne") {
                    console.log("1")
                    await connect(this, user);
                }
                else {
                    if(await isUser(this.id)){
                        let user = await findViaToken(token);
                        if(user.userId === this.id) {
                            await connect(this, user)
                        } else {
                            return message.channel.send(`<@${user.connexion}> est déjà connecté au compte ${user.userPseudo} (${user.userId})`);
                        }
                    } else {
                        return message.channel.send("Tu n'as pas démarré l'aventure.")
                    }
                }
            }

        }
    }
    return CustomUser;
})