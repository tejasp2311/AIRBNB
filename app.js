if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./Models/user");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapasync");

const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");

const app = express();

// MongoDB Atlas URL from .env
const dburl = process.env.ATLASDB_URL;

// Mongo session store
const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // 24 hours
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR", err);
});

// Session config
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
};

// View engine & public setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session, Flash & Passport
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals middleware (available in all templates)
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Connect to MongoDB
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

async function main() {
    await mongoose.connect(dburl);
}

// Routes
app.get("/", (req, res) => {
    res.send("Root Page");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Demo user creation route
app.get("/demouser", async (req, res) => {
    const fakeUser = new User({
        email: "student@gmail.com",
        username: "Student1"
    });

    const registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    req.flash("error", err.message || "Something went wrong!");
    res.redirect("/listings");
});

// Start server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
