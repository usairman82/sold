/*******************************************************************************
Author  : Casey@Cessnun.com                                   Created:2019-12-13
Synopsis: This is a very simple S3 Cache Integration.
*******************************************************************************/
const AWS            = require('aws-sdk');
const CacheInterface = require('./CacheInterface.js').CacheInterface;
const Utilities      = require('./Utilities.js').Utilities;

module.exports.Cache =  class Cache extends CacheInterface
                        {
                                /* istanbul ignore next */
                                constructor(config={})
                                {
                                    super(config);
                                    this._config = config;
                                    this.utils   = new Utilities(config);
                                    AWS.config.update({region: this._config.region});
                                }

                                async Store (key="", value="",ttl="86400000",returnPromise=false)
                                {
                                      var response = false;

                                      if (typeof value !== "string")
                                      {
                                          //By convention we'll require ttl to be specified in ms
                                          //Adding some metadata to the cached object for the purposes of
                                          //cache ttl checks.
                                          //I am defaulting cache ttl to 24 hours right now.
                                          value.magenta_cache_ttl     = ttl;
                                          value.magenta_cache_created = Date.now();
                                          value.magenta_cache_expires = parseInt(value.magenta_cache_created) + parseInt(ttl);
                                          value = JSON.stringify(value);
                                      }

                                      let s3Promise = new AWS.S3({region: this._config.region}).putObject({
                                                                     Bucket: this._config["cacheBucket"],
                                                                     Key: key,
                                                                     Body: value,
                                                                     ACL: 'private'
                                                                   }
                                                               ).promise();
                                     if (!returnPromise)
                                     {
                                        await s3Promise.then(
                                                             (d)=>{
                                                                     response = true;
                                                                  }
                                                           )
                                                      .catch(
                                                               (e)=>{
                                                                        /* istanbul ignore next */
                                                                        this.utils.ErrorMessage("Cache Store Failed:" + e.message + "["+this._config["cacheBucket"]+"]");
                                                                    }
                                                            );

                                    }
                                    else
                                    {
                                          response = s3Promise;
                                    }

                                    return response;
                                }

                                async IsExpired(key, returnValueIfNotExpired=false)
                                {
                                    let   bExpired = false;
                                    let   result   = bExpired;
                                    const data     = await this.Read(key);

                                    if (data)
                                    {
                                        if (typeof data.magenta_cache_expires !== "undefined")
                                        {
                                            /* istanbul ignore next */
                                            if (data.magenta_cache_expires < Date.now())
                                            {
                                                bExpired = true;
                                            }
                                        }

                                        /* istanbul ignore next */
                                        if (returnValueIfNotExpired && !bExpired)
                                        {
                                            result = data;
                                        }
                                        else /* istanbul ignore next */
                                        {
                                            result = bExpired;
                                        }
                                    }
                                    else /* istanbul ignore next */
                                    {
                                            result = true;
                                    }

                                    return result;
                                }

                                async Read (key)
                                {
                                     var cachedData = false;
                                     await new AWS.S3({region: this._config.region}).getObject(
                                                                                                { "Bucket": this._config["cacheBucket"], "Key": key }
                                                                                              ).promise().then((d)=>{
                                                                                                                         var tmpConfig = d.Body.toString();

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
                                                                                                                        this.utils.ErrorMessage("Cache Read Failed:" + e.message + "["+key+"]");
                                                                                                                        cachedData = false;
                                                                                                                    }
                                                                                                              );
                                     return cachedData;
                               }
                        };
