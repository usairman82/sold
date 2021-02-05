const AWS         = require("aws-sdk");
module.exports.Utilities = class Utilities
                           {
                                    constructor(config={})
                                    {
                                    }

                                    async  FetchConfig()
                                    {
                                        var CONFIG    = {};
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
                                                                                                  CONFIG    = JSON.parse(tmpConfig);
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

                                        }while(fail && failCount< CONFIG.maxRetries);

                                        if (failCount >CONFIG.maxRetries && fail)
                                        {
                                            console.error("ERROR:: Unexpected Issues Loading Config File. Troubleshooting Required.");
                                        }

                                        return CONFIG;
                                    }
};
