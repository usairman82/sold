const MariaDB     = require("./MariaDB.js").MariaDB;
const crypto      = require('crypto');
const HttpStatus  = require("http-status-codes");
const Utilities   = require("./Utilities.js").Utilities;

//Simple Class Wrapping Inventory Functionality
module.exports.Inventory = class Inventory {
    constructor(config={}) {
        this.config = config;
        this.utils  = new Utilities(config);
    }

    async Create(req) {
        return "Inventory.Create";
    }

    async Update(req) {
        return "Inventory.Update";
    }

    async FetchAll(req) {
        return "Inventory.FetchAll";
    }

    async Fetch(req) {
        return "Inventory.Fetch";
    }

    async Adjust(req) {
        return "Inventory.Adjust";
    }
};
