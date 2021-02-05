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
        //Lots of duplicated code, need iteritive refinement to cleanup
        //build some helpers.
        this.FetchAll = async (req)=>{
            var response = {"statusCode":HttpStatus.BAD_REQUEST, "error":"Parameter Validation Failed.","details":[]};
                console.log(req.params, req.query, req);
                //fix this, need to be paet of validation.
                if (typeof req.query["page"] == "undefined")
                {
                    req.query["page"] = this.config.defaults.pageOffset;
                }

                if (typeof req.query["limit"] == "undefined")
                {
                    req.query["limit"] = this.config.defaults.pageSize;
                }

                req      = await this.utils.ValidateParams(req);

            if (req.validated)
            {
                //Refactor to dedup code
                delete response.error;
                response.statusCode = HttpStatus.OK;
                response.data       = {};
                var response = await this.db.Query('call fetchPagedInventory',[req.query["page"]*req.query["limit"], req.query["limit"],req.user.data["userId"]]);
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
                var response = await this.db.Query('call fetchInventory',[req.params["id"] ,req.user.data["userId"]]);
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
    }

    async Create(req) {
        return "Inventory.Create";
    }

    async Update(req) {
        return "Inventory.Update";
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
