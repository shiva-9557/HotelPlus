const express = require("express");  //for using express
const Listing = require("../models/listing.js");// we create schema in chat.js to reduce bulkeyness of code
const wrapAsync = require("../utils/wrapAsyncs.js");
const Review = require("../models/review.js");
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.pos));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.del));


module.exports = router;