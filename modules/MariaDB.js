/*******************************************************************************
Author  : Casey@Cessnun.com                                   Created:2019-12-13
Synopsis: This is the "Abstract Base Class/Interface" for the cache system
and all of its various integrations.
*******************************************************************************/
const promisify               = require('util').promisify;
var   mariadb                 = require('mysql');
var   DatabaseEngineInterface = require('./DatabaseEngineInterface.js').DatabaseEngineInterface;

module.exports.MariaDB = class MariaDB extends DatabaseEngineInterface
{
    constructor(config = {}) {
        super(config);
        this._config      = config;
        this.pool         = mariadb.createPool(this._config.mariadb);
        this.promiseQuery = promisify(this.pool.query).bind(this.pool);
    }

    async GenerateParamPlaceholders(numParams) {

        var paramPlaceHolders = "("

        paramPlaceHolders += "?,".repeat(numParams);
        paramPlaceHolders = paramPlaceHolders.slice(0,-1) + ");"

        return paramPlaceHolders;
    }

    async Query(query = '', params = []) {
        var response = 'Attempting Query';

        console.log(response);
        //If someone forgot the (? placeholders, or otherwise forgot to include parens)
        if (query.indexOf("(") < 0)
        {
            query += await this.GenerateParamPlaceholders(params.length);
        }

        //This library behaves much like Prepared Statements in PHP
        console.log(query, data);
        response = await this.promiseQuery(query, params).then((data) => {
            console.log('data');
            console.log(data);
            return data;
        }).catch((err) => {
            console.log('Query Error Caught');
            console.log(err);
            return err;
        });

        console.log(JSON.stringify(response));
        response = await this.promiseQuery(query, params);
        console.log(JSON.stringify(response));

        console.log('1');
        console.log(response);
        return response;
    }
};
