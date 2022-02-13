const mongodb = require("mongodb");
// require("dotenv").config({ path: `../.env` });
require("dotenv").config({ path: `./.env` });
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const MongoClient = mongodb.MongoClient;
// const url = "mongodb://localhost:27017/";
const url = process.env.MONGODB_URL
const dbName = "ethyopianfood";
const uploadDirectory = "uploads/";
const fs = require('fs-extra')
console.log(url);

function getImage(req,res){
  const filename = path.join(__dirname,uploadDirectory,req.params.newFileName);
  res.sendFile(filename);
}

function newCollection(req, res) {
  let { collectionName } = req.body;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db(dbName);
    dbo.createCollection(collectionName, function (err, ans) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
      res.status(201).send("ok");
    });
  });
}
function addMenyRecpies(req, res) {
  let { collectionName, data } = req.body;
  data.map((recip, i) => (data[i].id = uuidv4()));
  
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection(collectionName).insertMany(data, function (err, ans) {
      if (err) throw err;
      console.log("Number of documents inserted: " + ans.insertedCount);
      db.close();
      res
        .status(201)
        .send("Number of documents inserted: " + ans.insertedCount);
    });
  });
}

function getAllRecipes(req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo
      .collection("recipes")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.status(200).send(result);
        db.close();
      });
  });
}

function getByCategories(req, res) {
  const userChoice = req.params.category;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var myquery = { category: userChoice };
    dbo
      .collection("recipes")
      .find(myquery)
      .toArray(function (err, result) {
        if (err) throw err;
        res.status(200).send(result);
        db.close();
      });
  });
}
function getOneRecip(req, res) {
  const userChoice = req.params;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("recipes").findOne(userChoice, function (err, result) {
      if (err) throw err;
      res.status(200).send(result);
      db.close();
    });
  });
}

function updateRecipe(req, res) {
  
  const userChoice = req.params;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("recipes").findOne(userChoice, function (err, result) {
      if (err) throw err;
      gotRecipe(result);
      db.close();
    });
  });
  const gotRecipe=(recipe)=>{
    delete recipe._id
    
    for (const property in recipe) {
      if(req.body[property]){
        if(property === "comments"){
          recipe[property].unshift(req.body[property]);
          if(recipe[property].length >=5){
            recipe[property] = recipe[property].slice(0,5);
          }
        }else{
          recipe[property] = req.body[property];
        }
      }
    }
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      var myquery = { id: recipe.id };
      var newvalues = { $set: recipe };
      dbo.collection("recipes").updateOne(myquery, newvalues, function(err, result) {
        if (err) throw err;
        console.log("1 document updated");
        res.status(200).send("ok");
        db.close();
      });
    });
    
  }
}

function newRecipe(req,res){
  // console.log(req.file.filename);
  // console.log(req.body);
  const myobj = {
    title:req.body.title,
    name:req.body.name,
    category:req.body.category,
    Ingredients:req.body.Ingredients,
    Instructions:req.body.Instructions,
    Nots:req.body.Nots,
    src:req.file.filename,
    comments:[],
    id:uuidv4(),
    localId:req.body.localId, 
  }
  

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("recipes").insertOne(myobj, function(err, result) {
      if (err) throw err;
      console.log("1 document inserted");
      res.sendStatus(201);
      db.close();
    });
  });
}

function getUsersRecipes(req,res){
  const userChoice = req.params.localId;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var myquery = { localId: userChoice };
    dbo
      .collection("recipes")
      .find(myquery)
      .toArray(function (err, result) {
        if (err) throw err;
        res.status(200).send(result);
        db.close();
      });
  });
}

function deleteRecipe(req,res){
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("recipes").findOne(req.params, function(err, result) {
      if (err) throw err;
      const filename =path.join(__dirname,`/uploads/${result.src}`) 
      fs.removeSync(filename)
      db.close();
    });
  });
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("recipes").deleteOne(req.params, function(err, obj) {
      if (err){
        res.status(400).send(err);
      }
      res.status(200).send("1 document deleted");
      db.close();
    });
  });
}




module.exports = {
  addMenyRecpies,
  newCollection,
  getAllRecipes,
  getByCategories,
  getOneRecip,
  updateRecipe,
  newRecipe,
  getImage,
  getUsersRecipes,
  deleteRecipe,
};
