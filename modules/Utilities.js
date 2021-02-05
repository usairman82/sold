const AWS         = require("aws-sdk");
const JWT         = require("jsonwebtoken");
module.exports.Utilities = class Utilities
                           {
                                    constructor(config={})
                                    {
                                        this.config = config;


                                        //Should turn these into an object/set of object
                                        //to support better valination in the future.
                                        this.Validate = {
                                                            "limit": async (req)=>{
                                                                                    if (typeof req.params["limit"] == "undefined")
                                                                                    {
                                                                                        req.params["limit"] = this.config.defaults["pageSize"];
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        if (isNaN(req.params["limit"]))
                                                                                        {
                                                                                            req.params["limt"] = this.config.defaults["pageSize"];
                                                                                        }
                                                                                    }

                                                                                    return req;
                                                                                },
                                                            "page": async (req)=>{
                                                                                    if (typeof req.params["page"] == "undefined")
                                                                                    {
                                                                                        req.params["page"] = this.config.defaults["pageOffset"];
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        if (isNaN(req.params["page"]))
                                                                                        {
                                                                                            req.params["page"] = this.config.defaults["pageOffset"];
                                                                                        }
                                                                                    }

                                                                                    return req;
                                                                                }
                                                        };

                                        //I am hacking this together, I could use something like
                                        //JSON Schema validation, or some other method of validating
                                        //However, without active requirements refinement I am making
                                        //an implementation call so as to not get stuck.  But the abstraction
                                        //should make it trivial to support new methods of validation.
                                        this.ValidateParams = async (req)=>{

                                            req.validated     = true;
                                            var invalidParams = [];
                                            for(let [key,val] of req.params)
                                            {
                                                if (typeof this.Validate[key] !== "undefined")
                                                {
                                                    req = this.Validate[key](req);
                                                    if (typeof req.validationResponse != "undefined")
                                                    {
                                                        if (!req.validationResponse.validated)
                                                        {
                                                            invalidParams.push({"params":key,"reason":req.validationResponse.reason});
                                                        }

                                                        req = req.req;
                                                    }
                                                }
                                            }

                                            if (invalidParams.length > 0)
                                            {
                                                req.validated     = false;
                                                req.invalidParams = invalidParams;
                                            }

                                            return req;
                                        };

                                        this.GenerateJWT = async (req)=>{
                                                                            console.log(req);
                                                                            return await JWT.sign({"data":req},this.config.JWT.sillyWeakKey,{ expiresIn: '1h' });
                                                                        };
                                        this.FetchConfig= async ()=>{
                                            var fail      = false;
                                            var failCount = 0;

                                            do
                                            {
                                                await new AWS.S3({region: process.env.REGION}).getObject(
                                                                          { "Bucket": process.env.CONFIG_BUCKET, "Key": process.env.CONFIG_KEY }
                                                                      ).promise().then((data)=>{
                                                                                                  let tmpConfig = data.Body.toString();

                                                                                                  try
                                                                                                  {
                                                                                                      this.config    = JSON.parse(tmpConfig);
                                                                                                      fail      = false;
                                                                                                      failCount = 0;
                                                                                                  }
                                                                                                  catch (e)
                                                                                                  {
                                                                                                        console.error("ERROR:: Exception while Fetching Config.  Probably malformed JSON.");
                                                                                                        console.error(e);
                                                                                                        console.errir(tmpConfig);
                                                                                                        fail = true;
                                                                                                        failCount++;
                                                                                                  }
                                                                                              }
                                                                                       )
                                                                                .catch((e)=>{
                                                                                                console.error("ERROR:: Exception while Fetching Config.  Probably malformed JSON.");
                                                                                                console.error(JSON.stringify(e));
                                                                                            }
                                                                                      );

                                            }while(fail && failCount< this.config.maxRetries);

                                            if (failCount >this.config.maxRetries && fail)
                                            {
                                                console.error("ERROR:: Unexpected Issues Loading Config File. Troubleshooting Required.");
                                            }

                                            return this.config;
                                        };
                                }
};
