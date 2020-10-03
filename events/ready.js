module.exports = class {
    constructor(client) {
      this.client = client;
    }
    async run(client) {
        console.log(`Prêt sur le compte ${client.user.tag}`)
    }
  };