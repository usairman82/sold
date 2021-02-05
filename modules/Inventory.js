const MariaDB     = require("./MariaDB.js").MariaDB;
const crypto      = require('crypto');
const HttpStatus  = require("http-status-codes");
const Utilities   = require("./Utilities.js").Utilities;

//Simple Class Wrapping Inventory Functionality
module.exports.Inventory = class Inventory {
    constructor(config={}) {
        this.config = config;
        this.db     = new MariaDB(config);
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
        var response = {"statusCode":HttpStatus.BAD_REQUEST, "error":"Parameter Validation Failed.","details":[]};
            console.log(req.params, req.query, req);
            req      = await this.utils.ValidateParams(req);

        if (req.validated)
        {
            //Refactor to dedup code
            delete response.error;
            response.statusCode = HttpStatus.OK;
            response.data       = {};
            var response = await this.db.Query('call adjustInventory',[req.params["id"],req.query["adjustment"],req.user.data["userId"]]);
            if (response.errno || !response) {
                console.error("MySQL Error", response);
                return [{
                            "error": "Database Error - " + response.Error
                       }];
                }

            return response[0];
        }
        else
        {
            response.details = req.invalidParams;
        }
    }
};
