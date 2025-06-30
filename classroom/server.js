const express = require("express");
const app = express();
const session = require("express-session"); 
const flash = require("connect-flash"); 
const path = require("path");

const sessionOptions = {
    secret : "mysecretsuperstring", 
    resave: false, 
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/reqCount", (req, res) => { 
    req.session.count = (req.session.count || 0) + 1;
    res.send(`You sent request ${req.session.count} times.`);
});

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    req.flash("success", "User registered successfully");
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.locals.messages = req.flash("success")
    res.render("page.ejs", { name: req.session.name});
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
