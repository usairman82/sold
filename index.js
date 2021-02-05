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
const express     = require("express");
var   jwt         = require('express-jwt');
const mariabd     = require("./modules/MariaDB.js");
const sls         = require("serverless-http");
const crypto      = require('crypto');
var   app         = express();
const Utilities   = require("./modules/Utilities.js").Utilities;
const Products    = require("./modules/Products.js").Products;
const Inventory   = require("./modules/Inventory.js").Inventory;
var   products    = new Products();
var   inventory   = new Inventory();
//Config Global
var  CONFIG   = {};

var isRevokedCallback = function(req, payload, done){
  var issuer = payload.iss;
  var tokenId = payload.jti;

  data.getRevokedToken(issuer, tokenId, function(err, token){
    if (err) { return done(err); }
    return done(null, !!token);
  });
};
/*app.get("/api/:userName", (req, res) => {
    res.send(`Welcome, ${req.params.userName}`);
})*/
var utils   = new Utilities();

async function InitializeRoutes(app) {

    //Define Products Routes
    app.get("/api/products", jwt({
        secret: CONFIG.JWT.sillyWeakKey,

        algorithms: ['HS256']
      }),async (req, res) => {
        res.send(await products.FetchAll(req));
    });

    app.get("/api/product/:id", jwt({
        secret: CONFIG.JWT.sillyWeakKey,

        algorithms: ['HS256']
    }),async (req, res) => {
        res.send(await products.Fetch(req));
    });

    app.post("/api/product", jwt({
        secret: CONFIG.JWT.sillyWeakKey,

        algorithms: ['HS256']
    }), async (req, res) => {
        res.send(await products.Create(req));
    });

    app.put("/api/product/:id", jwt({
        secret: CONFIG.JWT.sillyWeakKey,

        algorithms: ['HS256']
    }), async (req, res) => {
        res.send(await products.Update(req));
    });

    app.get("/api/product/search", jwt({
        secret: CONFIG.JWT.sillyWeakKey,

        algorithms: ['HS256']
    }), async (req, res) => {
        res.send(await products.Search(req));
    });

    //Inventory
    app.get("/api/inventory", jwt({
        secret: CONFIG.JWT.sillyWeakKey,

        algorithms: ['HS256']
    }), async (req, res) => {
        res.send(await inventory.FetchAll(req));
    });

    app.get("/api/inventory/:id", jwt({
        secret: CONFIG.JWT.sillyWeakKey,

        algorithms: ['HS256']
    }), async (req, res) => {
        res.send(await inventory.Fetch(req));
    });

    app.post("/api/inventory", jwt({
        secret: CONFIG.JWT.sillyWeakKey,

        algorithms: ['HS256']
    }), async (req, res) => {
        res.send(await inventory.Create(req));
    });

    app.put("/api/inventory/:id", jwt({
        secret: CONFIG.JWT.sillyWeakKey,

        algorithms: ['HS256']
    }), async (req, res) => {
        res.send(await inventory.Update(req));
    });

    app.get("/api/inventory/:id/adjust", jwt({
        secret: CONFIG.JWT.sillyWeakKey,

        algorithms: ['HS256']
    }), async (req, res) => {
        res.send(await inventory.Adjust(req));
    });

    app.get("/api/auth", async(req, res)=>{
        res.send(await utils.GenerateJWT(req));
    });

    return app;
};

const jsonErrorHandler = async (err, req, res, next) => {
  res.status(500).send({ error: err });
}

module.exports.handler = async(event)=>{
    CONFIG = await utils.FetchConfig();
    utils  = new Utilities(CONFIG);
    app    = await InitializeRoutes(app);

    //https://expressjs.com/en/starter/faq.html
    app.use(function (err, req, res, next) {
      console.error(err.stack)
      res.status(500).send(JSON.stringify({"error":err}));
    });

    app.use(function (req, res, next) {
      res.status(501).send(JSON.stringify({"error":"Not Implemented"}));
    });

    app.use(function (req, res, next) {
      res.status(404).send(JSON.stringify({"error":"Not Found"}));
    });


    const handler = sls(app);
    const result  = await handler(event);

    return result;
};
