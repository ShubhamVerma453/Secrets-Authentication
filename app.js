const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passpost = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret : "thisIsASecretKey",
    resave : false,
    saveUninitialized : false
}));
app.use(passpost.initialize());
app.use(passpost.session());

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/secretsDB", { useNewUrlParser: true });
const credentialSchema = new mongoose.Schema({ username : String, password : String });
credentialSchema.plugin(passportLocalMongoose);
const Credential = mongoose.model("credential", credentialSchema);
passpost.use(Credential.createStrategy());
passpost.serializeUser(Credential.serializeUser());
passpost.deserializeUser(Credential.deserializeUser());

app.get("/", (req, res)=>{
    res.render("home");
});
app.get("/register", (req, res)=>{
    res.render("register");
});
app.get("/login", (req, res)=>{
    res.render("login");
});
app.get("/secret", (req, res)=>{
    if(req.isAuthenticated())
        res.render("secrets");
    else 
        res.redirect("/");
})

app.post("/register", (req, res)=>{
    // console.log(req.body);
    Credential.register({username : req.body.username}, req.body.password, (err, cred)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        } else {
            passpost.authenticate("local")(req, res, ()=>{
                res.redirect("/secret");
            })
        }
    })
    
});
app.post("/login", (req, res)=>{
    
});

app.listen(3000, ()=>{
    console.log("listening 3000");
});