const express = require("express");
const router = express.Router({ mergeParams: true });
 const wrapAsync = require("../utils/wrapasync.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

router.post("/",isLoggedIn, wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
