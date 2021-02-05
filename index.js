/******************************************************************************
Author   : casey@cessnun.com                                Created: 2021-02-04
Synopsis : this is a simple API as defined by the hiring team.  it leverages
ExpressJS as the routing engine for speed of development sake as well as being
generally well known and employed, thus fairly easy to find people to maintain.

Though the team works primarily in PHP I decided to implement this ins NodeJS
again for speed sake as well as scaleability.   Introducing a scaleable solution
in a couple of hours time was simpler this way.   I could have chosen to implement
this in Python natively in AWS Lambda, or I could have developed a docker container
with an application built in PHP behind  Apache or Nginx.  However, I felt this
would be more expedient.  Further, NodeJS, while not my favorite language, is well
know by many junior developers and would make maintaining it easier.
*******************************************************************************/
const AWS     = require("aws-sdk");
const express = require("express");
var   jwt     = require('express-jwt');
const mariabd = require("./modules/MariaDB.js");
const sls     = require("serverless-http");
const app     = express();

//Config
var  CONFIG   = {};
async function FetchConfig()
{
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
}

FetchConfig();
console.log(CONFIG);

//Products
app.get("/api/products", (req, res) => {
    res.send("/api/products");
});

app.get("/api/product/:id", (req, res) => {
    res.send("/api/products/"+req.params.id);
});

app.post("/api/product", (req, res) => {
    res.send("POST /api/products/");
});

app.put("/api/product/:id", (req, res) => {
    res.send("PUT /api/product/");
});

app.get("/api/product/search", (req, res) => {
    res.send("/api/products/search");
});

//Inventory
app.get("/api/inventory", (req, res) => {
    res.send("/api/products");
});

app.get("/api/inventory/:id", (req, res) => {
    res.send("/api/inventory/"+req.params.id);
});

app.post("/api/inventory", (req, res) => {
    res.send("POST /api/inventory/");
});

app.put("/api/inventory/:id", (req, res) => {
    res.send("PUT /api/inventory/"+req.params.id);
});

app.get("/api/inventory/:id/adjust", (req, res) => {
    res.send("/api/inventory/adjust:"+req.params.id);
});





/*app.get("/api/:userName", (req, res) => {
    res.send(`Welcome, ${req.params.userName}`);
})*/

module.exports.handler = sls(app);
