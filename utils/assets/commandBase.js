const path = require("path");

  module.exports = class Command {
    constructor(client, {
      name = null,
      dirname = false,
      aliases = new Array(),
    }) {
      const category = (dirname ? dirname.split(path.sep)[parseInt(dirname.split(path.sep).length - 1, 10)] : "Other");
      this.client = client;
      this.help = {
        name,
        category,
        aliases
      };
    }
  };