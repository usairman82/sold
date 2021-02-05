const MariaDB     = require("./MariaDB.js").MariaDB;
const sls         = require("serverless-http");
const crypto      = require('crypto');
const HttpStatus  = require("http-status-codes");

module.exports.Users = class User {

        constructor(config={})
        {
            this.db   = new MariaDB(config);
            this.hash = crypto.createHash('sha512');

            this.HashPassword = async (password)=>{
                    this.hash.update(password.toString());
                    return this.hash.digest("hex");
            };

            this.AuthenticateUser = async (credentials)=>{
                var response = await this.db.Query('call authenticatUser',[credentials["userEmail"], await this.HashPassword(credentials["password"])]);
                if (response.errno || !response) {
                    console.error("MySQL Error", response);
                    return [{
                                "error": "Database Error - " + response.Error,
                                "userId": "-1",
                                "name":"",
                                "superAdmin":"0",
                                "shopName":"",
                                "userAuthenticated":"0"
                        }];
                    }

                return response;
            };
        }
}
