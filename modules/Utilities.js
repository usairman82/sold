const AWS         = require("aws-sdk");
const JWT         = require("jsonwebtoken");
module.exports.Utilities = class Utilities
                           {
                                    constructor(config={})
                                    {
                                        this.config = config;

                                        this.GenerateJWT = async (req)=>{
                                                                            console.log(req);
                                                                            return await JWT.sign({"userId":"123", "expires":"2021-02-04 8:45PM"},this.config.JWT.sillyWeakKey);
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
