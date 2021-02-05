const MariaDB     = require("./MariaDB.js").MariaDB;
const crypto      = require('crypto');
const HttpStatus  = require("http-status-codes");
const Utilities   = require("./Utilities.js").Utilities;

//Simple Class Wrapping Product Functionality
module.exports.Products = class Products {
    constructor(config={}) {
        console.log("==><==");
        console.log(config, config.mariadb);
        this.db     = new MariaDB(config);
        this.utils  = new Utilities(config);
        this.config = config;

        this.Create = async (req)=> {
            return "Products.Create";
        };

        this.Update = async (req)=> {
            return "Products.Update";
        };

        //Lots of duplicated code, need iteritive refinement to cleanup
        //build some helpers.
        this.FetchAll = async (req)=>{
            var response = {"statusCode":HttpStatus.BAD_REQUEST, "error":"Parameter Validation Failed.","details":[]};
                console.log(req.params, req.query, req);
                req      = await this.utils.ValidateParams(req);

            if (req.validated)
            {
                //Refactor to dedup code
                delete response.error;
                response.statusCode = HttpStatus.OK;
                response.data       = {};
                var response = await this.db.Query('call fetchPagedProducts',[req.query["page"]*req.query["limit"], req.query["limit"],req.user.data["userId"]]);
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
        };

        this.Fetch = async (req)=> {
            var response = {"statusCode":HttpStatus.BAD_REQUEST, "error":"Parameter Validation Failed.","details":[]};
                console.log(req.params, req.query, req);
                req      = await this.utils.ValidateParams(req);

            if (req.validated)
            {
                //Refactor to dedup code
                delete response.error;
                response.statusCode = HttpStatus.OK;
                response.data       = {};
                var response = await this.db.Query('call fetchProduct',[req.query["id"],req.user.data["userId"]]);
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
            };
        };

        this.Search = async (req)=> {
            return "Products.Search";
        };
    }
};
