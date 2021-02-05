const MariaDB     = require("./MariaDB.js").MariaDB;
const crypto      = require('crypto');
const HttpStatus  = require("http-status-codes");

//Simple Class Wrapping Product Functionality
module.exports.Products = class Products {
    construct() {

    }

    async Create(req){
        return "Products.Create";
    }

    async Update(req){
        return "Products.Update";
    }

    async FetchAll(req){
        return "Products.Fetch";
    }

    async Fetch(req){
        return "Products.Fetch";
    }

    async Search(req){
        return "Products.Search";
    }
};
