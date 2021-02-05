/*******************************************************************************
Author  : Casey@Cessnun.com                            Created:2019-12-13
Synopsis: This is the "Abstract Base Class/Interface" for the cache system
and all of its various integrations.
*******************************************************************************/

module.exports.CacheInterface = class CacheInterface
{
    constructor(config = {})
    {
        this._config = config;
    }

    async Store(key, value)
    {
        /*ABSTRACT*/
        return false;
    }

    async Read(key)
    {
        /*ABSTRACT*/
        return false;
    }

    async IsExpired(key)
    {
        /*ABSTRACT*/
        return false;
    }
};
