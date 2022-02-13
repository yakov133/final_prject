console.log("app is loading");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
app.use(cors());

const multer = require("multer");
const uploadDirectory = "uploads/";
const upload = multer({ dest: uploadDirectory });

// used for json inside body
app.use(express.json());
const utilis = require("./utilies");

app.post("/newCollection", (req, res) => {
  utilis.newCollection(req, res);
});

app.post("/recipes", (req, res) => {
  utilis.addMenyRecpies(req, res);
});

app.get("/recipes", (req, res) => {
  utilis.getAllRecipes(req, res);
});

app.get("/recipe/:id", (req, res) => {
  utilis.getOneRecip(req, res);
});

app.get("/categories/:category", (req, res) => {
  utilis.getByCategories(req, res);
});

app.patch("/recipe/:id", (req, res) => {
  utilis.updateRecipe(req, res);
});

app.post("/recipe", upload.single("someFile"), (req, res) => {
  utilis.newRecipe(req, res);
});

app.get("/image/:newFileName", (req,res)=>{
  utilis.getImage(req,res);
})

app.get("/recipe/user/:localId", (req, res) => {
  utilis.getUsersRecipes(req,res);
});

app.delete("/recipe/:id",(req,res)=>{
  utilis.deleteRecipe(req,res);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
