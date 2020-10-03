const Command = require("../../utils/assets/CommandBase.js");

module.exports = class Deconnexion extends Command {

    constructor (client) {
        super(client, {
            name: "deconnexion",
            dirname: __dirname,
            enabled: true,
            aliases: ["d"],
        });
    }

    async run (client, message, args) {
        await message.author.disconnect();
    }

}
