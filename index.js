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
const AWS         = require("aws-sdk");
const express     = require("express");
var   jwt         = require('express-jwt');
const mariabd     = require("./modules/MariaDB.js");
const sls         = require("serverless-http");
const app         = express();
const Utilities   = require("./modules/Utilities.js").Utilities;
const Products    = require("./modules/Products.js").Products;
const Inventory   = require("./modules/Inventory.js").Inventory;
var   products    = new Products();
var   inventory   = new Inventory();
//Config Global
var  CONFIG   = {};

//Define Products Routes
app.get("/api/products", async (req, res) => {
    res.send(products.FetchAll(req));
});

app.get("/api/product/:id", async (req, res) => {
    res.send(products.Fetch(req));
});

app.post("/api/product", async (req, res) => {
    res.send(products.Create(req));
});

app.put("/api/product/:id", async (req, res) => {
    res.send(products.Update(req));
});

app.get("/api/product/search", async (req, res) => {
    res.send(products.Search(req));
});

//Inventory
app.get("/api/inventory", async (req, res) => {
    res.send(inventory.FetchAll(req));
});

app.get("/api/inventory/:id", async (req, res) => {
    res.send(inventory.Fetch(req));
});

app.post("/api/inventory", async (req, res) => {
    res.send(inventory.Create(req));
});

app.put("/api/inventory/:id", async (req, res) => {
    res.send(inventory.Update(req));
});

app.get("/api/inventory/:id/adjust", async (req, res) => {
    res.send(inventory.Adjust(req));
});





/*app.get("/api/:userName", (req, res) => {
    res.send(`Welcome, ${req.params.userName}`);
})*/
const handler = sls(app);
const utils   = new Utilities();

module.exports.handler = async(event)=>{
    await utils.FetchConfig();
    const result = await handler(event);

    return result;
};
