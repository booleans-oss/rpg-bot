const mongoose = require('mongoose');
// require du module "mongoosejs"
let ItemSchema = new mongoose.Schema({ "name": {type: String, required: true}, "effectif": {type: Number, default: 1, required: true} });
// définition du schema des items de l'inventaire: le nom de l'item (String), et la quantité (Number)
const UserSchema = new mongoose.Schema({
// déclaration du nouveau schema user
    _id: { type: mongoose.ObjectId },
    // l'ID de l'indexe dans la base de données (unique)
    userId: { type: String, required: true},
    // l'ID de l'utilisateur [obligatoire] (String) 
    userPseudo: { type: String, required: true},
    // l'ID de l'utilisateur [obligatoire] (String) 
    userClan: { type: Object, required: false},
    // le clan de l'utilisateur [pas obligatoire] (Objet)
    userLvl:{ type: Number, required: false, default: 0},
    // le level de l'utilisateur [pas obligatoire] - défault: 0 (Nombre)
    userExp: { type: Number, required: false, default: 0},
    // l'expérience de l'utilisateur [pas obligatoire] - défault: 0 (Nombre)
    ressources: { type: [ItemSchema], required: false, default: []},
    // les ressources de l'utilisateur [pas obligatoire] - default: [] ~Rien~ (Array) 
    food: { type: [ItemSchema], required: false, default: []},
    // la nourriture de l'utilisateur [pas obligatoire] - default: [] ~Rien~ (Array) 
    inventory: { type: [ItemSchema], required: false, default: []},
    // l'inventaire de l'utilisateur [pas obligatoire] - default: [] ~Rien~ (Array) 
    guildRank: { type: String, required: false, default: "none"},
    // les rôles de l'utilisateur dans la guild [pas obligatoire] - default: "none" (String)
    motdepasse: { type: String, required: false, default: "default1234"},
    // mot de passe de l'utilisateur [pas obligatoire] - default: "default1234" (String)
    connexion: { type: String, required: false, default: "personne"}
})
module.exports = mongoose.model('user', UserSchema);
// exportation du schema