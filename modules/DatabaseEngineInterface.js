/*******************************************************************************
Author  : Casey@Cessnun.com                                   Created:2019-12-13
Synopsis: This is the "Abstract Base Class/Interface" for the cache system
and all of its various integrations.
*******************************************************************************/

module.exports.DatabaseEngineInterface = class DatabaseEngineInterface
{
    constructor(config = {})
    {
        this._config = config;
    }

    async Query(query, params)
    {
        /*ABSTRACT*/
        return false;
    }
};
