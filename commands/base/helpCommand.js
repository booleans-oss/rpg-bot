const Discord = require('discord.js');

const Command = require("../../utils/assets/CommandBase.js");
  module.exports = class help extends Command {

    constructor (client) {
        super(client, {
          name: "help",
          dirname: __dirname,
          enabled: true,
          aliases: [ "help", "h", "aide" ],
        });
      }

      async run(client, message, args) {

          let firstHelpEmbed = new Discord.MessageEmbed()
            .setColor('red')
            .setTimestamp()
            .setDescription(`Le préfixe actuel est : ${process.env.PREFIX_BOT}\nPour toute réclamation, contactez un des développeurs.`)

          let secondHelpEmbed = new Discord.MessageEmbed()
            .setColor('red')
            .setTimestamp()
            .setDescription(`<:005sword:748442055898038322> __Début d'aventure__
                            \n\`\`start-adventure | s-a\`\` : commencez votre aventure

                            \n<:018shield2:748238161838080068> __Guildes - Clans__
                            \n\`\`create-guild | c-g\`\` : créez votre propre guilde
                            \n\`\`join-guild | j-g <id>\`\` : rejoindre une guilde
                            \n\`\`leave-guild | l-g\`\` : quitter une guilde
                            \n\`\`search-guild <element>\`\` : recherchez le nom d'une guilde`)



            message.channel.send(firstHelpEmbed)

            message.channel.send(secondHelpEmbed)
      }

  }