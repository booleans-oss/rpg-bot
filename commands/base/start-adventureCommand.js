const Command = require("../../utils/assets/CommandBase.js");
  module.exports = class StartAdventure extends Command {
  
    constructor (client) {
      super(client, {
        name: "start-adventure",
        dirname: __dirname,
        enabled: true,
        aliases: [ "start", "s-a" ],
      });
    }
  
    async run (client, message, args) {
      await message.author.insertIntoDatabase(message);
    }
  
  }
  