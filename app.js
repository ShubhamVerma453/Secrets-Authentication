const express = require("express");
const ejs = require("ejs")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/secretsDB", { useNewUrlParser: true });
const credentialSchema = new mongoose.Schema({ email : String, password : String });
const Credential = mongoose.model("credential", credentialSchema);

app.get("/", (req, res)=>{
    res.render("home");
});
app.get("/register", (req, res)=>{
    res.render("register");
});
app.get("/login", (req, res)=>{
    res.render("login");
});

app.listen(3000, ()=>{
    console.log("listening 3000");
});