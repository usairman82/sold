const mariadb     = require("./modules/MariaDB.js");
const sls         = require("serverless-http");
const crypto      = require('crypto');

module.exports.Users = class Users {

        construct(config={})
        {
            this.db   = new mariadb(config);
            this.hash = crypto.createHash('sha512');

            this.HashPassword = async (password)=>{
                    this.hash.update(password.toString());
                    return this.hash.digest("hex");
            };

            this.AuthenticatUser = async (userEmail, passwordHash)=>{

            };
        }
}
