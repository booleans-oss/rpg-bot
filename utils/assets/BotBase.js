const {
    Client
} = require("discord.js");
const { readdirSync } = require("fs");
const path = require("path");
require('../../structures/User')
class Bot extends Client {
    constructor(options) {
        super(options);
        this.commands = new Map();
        this.aliases = new Map();
    }
    async chargementCommand() {
        const directories = readdirSync("./commands/");
        directories.forEach(async (dir) => {
            const commands = await readdirSync("./commands/" + dir + "/");
            try {
                commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
                    const props = new(require(`../../commands/${dir}${path.sep}${cmd}`))(this);
                    this.commands.set(cmd.slice(0, -10).toLowerCase(), props);
                    props.help.aliases.forEach((alias) => {
                        this.aliases.set(alias.toLowerCase(), props.help.name.toLowerCase());
                    });
                });
            } catch (e) {
                console.log(e)
            }
        });
    }
    async chargementEvent(bot) {
        const evtFiles = await readdirSync("./events/");
        evtFiles.forEach((file) => {
            const eventName = file.split(".")[0];
            const event = new(require(`../../events/${file}`))(this);
            bot.on(eventName, (...args) => event.run(bot, ...args));
            delete require.cache[require.resolve(`../../events/${file}`)];
        });
    }
}
module.exports = Bot;