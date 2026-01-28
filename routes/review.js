let express = require("express");
let router = express.Router({ mergeParams: true });
let wrapAsync = require("../utils/wrapAsync");
let ExpressError = require("../utils/ExpressError");
let { reviewSchema } = require("../schema");
let Review = require("../models/review.js");
let Listing = require("../models/listing.js");
const {validationReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

let reviewControllers=require("../controllers/review.js")

// creating a POST route for the review
router.post(
  "/",isLoggedIn,
  validationReview,
  wrapAsync(reviewControllers.createReview)
);

// Review Delete Route 
router.delete(
  "/:reviewid",isLoggedIn,isReviewAuthor,
  wrapAsync(reviewControllers.deleteReview)
);

module.exports = router;
