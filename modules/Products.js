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

    //Lots of duplicated code, need iteritive refinement to cleanup
    //build some helpers.
    async FetchAll(req) {
        var response = {"statusCode":HttpStatus.BAD_REQUEST, "error":"Parameter Validation Failed.","details":[]};
        req = this.utils.ValidateParams(req);
        if (req.validated)
        {
            //Refactor to dedup code
            console.log(req);
            delete response.error;
            response.statusCode = HttpStatus.OK;
            response.data       = {};
            var response = await this.db.Query('call fetchPagedProducts',[req.params["page"]*req.params["limit"], req.params["limit"],req.user["userId"]]);
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

    async Fetch(req) {
        return "Products.Fetch";
    }

    async Search(req) {
        return "Products.Search";
    }
};
