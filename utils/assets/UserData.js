const db = require('../../database/database');
const UserModel = require('../../models/UserModel');
const { hash, compare } = require('bcrypt')
const database = db.get('user');
// Connexion à la base de données, rien ne change ici
const data = [{
    // Déclaration des messages qui seront envoyés
    result: "pseudo",
    // Le résultat de l'utilisateur
    error: "Votre pseudonyme ne peut pas contenir d'espace ou de caractères spéciaux.",
    // L'erreur à afficher si le message de l'utilisateur ne respecte pas les règles
    regexp: "^(\\w)*$",
    // RegExp qui "filtre" les messages pour avoir un pseudonyme sans espace
    embed_structure: {
        // L'embed qui sera envoyé
        title: "Inscription",
        thumbnail: {
            url: 'https://cdn.discordapp.com/attachments/747725352083783772/747727649924972594/053-save.png',
        },
        description: "Pour vous inscrire, veuillez envoyer le pseudonyme de votre choix ?",
        footer: {
            text: '1/3',
           
        }
    }
    
},
{   result: "mdp",
    // Le résultat de l'utilisateur
    error: "Votre mot de passe doit contenir au moins 7 caractères (espaces interdits)",
    // L'erreur à afficher si le message de l'utilisateur ne respecte pas les règles
    regexp: "^(?=.*[a-zA-Z\\d].*)[a-zA-Z\\d!@#$%&*]{7,}$",
    // RegExp qui "filtre" le mot de passe ait au moins 7 caractère, un chiffre et une lettre
    embed_structure: {
    // L'embed qui sera envoyé
        title: "Inscription",
        thumbnail: {
            url: 'https://cdn.discordapp.com/attachments/747725352083783772/747727649924972594/053-save.png',
        },
        description: "Pour continuer votre inscription, veuillez envoyer le mot de passe de votre choix ?",
        footer: {
            text: '2/3',
           
        }
    }
    
},
{   result: "guilde",
    // Le résultat de l'utilisateur
    error: "L'ID ne peut contenir que des chiffres",
    // L'erreur à afficher si le message de l'utilisateur ne respecte pas les règles
    regexp: "^(\\d)*$",
    // RegExp qui "filtre" le message de l'utilisateur pour que ce soit un ID (uniquement des chiffres)
    embed_structure: {
    // L'embed qui sera envoyé
    title: "Inscription",
    thumbnail: {
        url: 'https://cdn.discordapp.com/attachments/747725352083783772/747727649924972594/053-save.png',
    },
    description: "(OPTIONNEL) Avez-vous une guilde ? Si oui, veuillez indiquer l'ID de la guild.",
    footer: {
        text: '3/3 (ajouter la réaction pour passer cette question)',
       
}
    
    }
}]
async function registry(user) {
    // Fonction de l'inscription
    let UserInfo = {
        // Initialisation des informations
        pseudo: "",
        mdp: "",
        guilde: "none"
    }
    for(let i = 0; i < data.length; i++){
        // Boucle qui parcout "data" (les messages Embeds)
        let msg = await user.send({embed: data[i].embed_structure})
        // Envoie des messages Embed
        let result = await collectorHandler(msg, i, user);
        // Début du collector pour attendre la réponse de l'utilisateur (result devient la réponse de l'utilisateur)
        UserInfo[data[i].result] = result;
        // On met à jour les informations en fonction de la réponse de l'utilisateur
    }
    // Fin de la boucle des messages Embeds
        hash(UserInfo.mdp, 10, (err, hash) => {

        let UserData = new UserModel({
            // Création du nouvelle utilisateur
            userId: user.id,
            // L'ID de l'utilisateur
            userPseudo: UserInfo.pseudo,
            // Le pseudo choisi
            userClan: { id: UserInfo.guilde },
            // L'ID de la guilde (clan est un Object)
            motdepasse: hash,
            // Le mot de passe choisi
            connexion: user.id,
            // Connecte l'utilisateur à son compte
        }); 
    
    database.insert(UserData).then((result) => {
        // Insertion de l'utilisateur dans la base de donneées
        user.send("Vous avez bien été ajouté à la base de données. Voici votre profil de base").then(() => {
            // Message de confirmation pour être sûr que tout se soit bien enregistré
            user.send({embed: {
                // Embed contenant les informations de l'utilisateur
                title: `Compte de ${UserInfo.pseudo}`,
                thumbnail: {
                    url: 'https://cdn.discordapp.com/attachments/747725352083783772/747727649924972594/053-save.png',
                },
                description: `Voici les informations importantes de votre compte: \n > Token: \`\`${result._id}\`\` \n > Pseudonyme: \`\`${UserInfo.pseudo}\`\`\n > Mot de passe: || ${UserInfo.motdepasse} ||`,
                }})
        })
    })
})
}


async function collectorHandler(msg, i, utilisateur) {
    // Fonction qui "maîtrise" les différents collector
        return new Promise(async (resolve) => {
            // On crée une promesse pour quele bot puisse attendre "resolve" avant de continuer le code
       const guildCollectorFilter = m => m.channel.id === msg.channel.id && !m.author.bot;
       // On filtre les messages, pour que ce soit en MP, et que ce ne soit pas les messages du bot
       const guildChannelCollector = msg.channel.createMessageCollector(guildCollectorFilter);
       // Création du collector
       if(i === 2){
           // Vérification si la question posée n'est pas celle de la guilde (optionnelle)
        await msg.react("❌")
           // On ajoute la réaction qui permet de passer la question
        const reactionFilter = (reaction, user) => ["❌"].includes(reaction.emoji.name) && !user.bot && user.id === utilisateur.id;
        // Filtre les réactions, pour que ce soit obligatoirement ❌ et que ce soit l'utilisateur qui l'ajoute (et pas le bot)
        const reactionCollector = msg.createReactionCollector(reactionFilter, { max: 1 });
        // Création du collector
        reactionCollector.on('collect', (reaction, user) => {
            // Dès que le collector reçoit une réaction
            resolve();
            reactionCollector.stop("Emoji");
            guildChannelCollector.stop(" ");
            // Arrêt de tout les collectors (message + reaction)
        });
    }
        guildChannelCollector.on('collect', (m) => {
            // Dès que le collector reçoit un message
          let reg = new RegExp(data[i].regexp, 'g');
          // On convertit l'expression regExp dans "data' (String) en vrai regExp
          if(!reg.test(m.content)) {
              // On teste si le message passe le teste ( si le message est valide)
              return msg.channel.send(data[i].error)
              // Sinon, on envoie le message d'erreur
          }
          else {
            guildChannelCollector.stop("Done")
            resolve(m.content)
              // On stoppe le collector de message, et on envoie la valeur que l'utilisateur a envoyée
          }
      })
        })
}

async function connect(user, profile) {
    let msg = await user.send(`Quel est le mot de passe du compte (${profile._id}) [pseudo: ${profile.userPseudo}]`);
    let filtre = m => m.author.id === user.id && m.channel.id === msg.channel.id;
    try {
        let data = (await msg.channel.awaitMessages(filtre, {max: 1, time: 10000})).first().content;
        compare(data, profile.motdepasse, function(err, result) {
            if(err) return console.log(err)
           if(result === true) {
               msg.channel.send(`Vous vous êtes bien connecté au compte ${profile._id} = ${profile.userPseudo}`);
               database.findOneAndUpdate({_id: profile._id}, {$set: { connexion: user.id} }).then(() => {
                   console.log("Réussi")
               }).catch(e => console.log(e))

           }
           else {
               return msg.channel.send("Le mot de passe envoyé est incorrect. Veuillez re-essayer plus tard.")
           }
        });
    } catch(err) {
        if(err) return console.log(err);
        user.send("Vous avez pris trop de temps à vous connecter. ")
    }

}


module.exports = {
    registry, connect
}