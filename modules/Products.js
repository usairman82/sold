const MariaDB     = require("./MariaDB.js").MariaDB;
const crypto      = require('crypto');
const HttpStatus  = require("http-status-codes");
const Utilities   = require("./modules/Utilities.js").Utilities;

//Simple Class Wrapping Product Functionality
module.exports.Products = class Products {
    construct(config={}) {
        this.config = config;
        this.utils  = new Utilities(config);
    }

    async Create(req) {
        return "Products.Create";
    }

    async Update(req) {
        return "Products.Update";
    }

    async FetchAll(req) {
        return "Products.Fetch";
    }

    async Fetch(req) {
        return "Products.Fetch";
    }

    async Search(req) {
        return "Products.Search";
    }
};
