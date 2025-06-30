const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../Models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController  = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })


router.route("/")
    .get(wrapAsync(listingController.index))                                // index route
    .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createListing)); // create route

//new route 
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(listingController.show)                                        //show route
    .put(isLoggedIn,upload.single("listing[image]"), listingController.udpdateRoute)                    //Edit Route
    .delete(isLoggedIn,isOwner, listingController.destroyListing);      //Delete Route

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, listingController.renderEditForm);

module.exports = router;
