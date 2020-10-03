const Command = require("../../utils/assets/CommandBase.js");

  module.exports = class Connexion extends Command {
  
    constructor (client) {
      super(client, {
        name: "connexion",
        dirname: __dirname,
        enabled: true,
        aliases: ["c"],
      });
    }
  
    async run (client, message, args) {
      let token = args[0]
      await message.author.isConnected(token, message);
    }
  
  }
  