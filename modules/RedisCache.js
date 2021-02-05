/*******************************************************************************
Author  : Casey@Cessnun.com                                   Created:2019-12-13
Synopsis: This is a very simple S3 Cache Integration.
*******************************************************************************/
const AWS = require('aws-sdk');
const CacheInterface = require('./CacheInterface.js').CacheInterface;
const Utilities = require('./Utilities.js').Utilities;
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

module.exports.Cache = class Cache extends CacheInterface
{
    /* istanbul ignore next */
    constructor(config = {})
    {
        super(config);
        this._config = config;
        this.utils = new Utilities(config);
        this.client = redis.createClient(this._config.redisCluster);
    }

    async Store(key = '', value = '', ttl = '86400000', returnPromise = false)
    {
        var response = false;

        if (typeof value !== 'string')
        {
            //By convention we'll require ttl to be specified in ms
            //Adding some metadata to the cached object for the purposes of
            //cache ttl checks.
            //I am defaulting cache ttl to 24 hours right now.
            value.magenta_cache_ttl = ttl;
            value.magenta_cache_created = Date.now();
            value.magenta_cache_expires = value.magenta_cache_created + ttl;
            value = JSON.stringify(value);
        }

        let redisPromise = this.client.setAsync(key, value);

        if (!returnPromise)
        {
            await redisPromise.then(
                (d)=>{
                    response = true;
                }
            )
                .catch(
                    (e)=>{
                        this.utils.ErrorMessage('Cache Store Failed:' + e.message + '[' + this._config['redisCluster'] + ']');
                    }
                );

        }
        else
        {
            response = redisPromise;
        }

        return response;
    }

    async IsExpired(key)
    {
        let bExpired = false;
        const data = await this.Read(key);

        if (typeof data.magenta_cache_expires !== 'undefined')
        {
            if (data.magenta_cache_expires < Date.now())
            {
                bExpired = true;
            }
        }

        return bExpired;
    }

    async Read(key)
    {
        var cachedData = false;
        await await this.client.getAsync(key).then((d)=>{
            var tmpConfig = d;

            if (typeof d !== 'object')
            {
                tmpConfig = d.toString();
            }

            try
            {
                cachedData = JSON.parse(tmpConfig);
            }
            catch(ex)
            {
                cachedData = tmpConfig;
            }
        }
        )
            .catch((e)=>{
                this.utils.ErrorMessage('Cache Read Failed:' + e.message + '[' + key + ']');
                cachedData = false;
            }
            );
        return cachedData;
    }
};
