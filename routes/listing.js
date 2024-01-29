const express = require("express");  //for using express
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
// we create schema in chat.js to reduce bulkeyness of code
const wrapAsync = require("../utils/wrapAsyncs.js");
const router = express.Router();
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage});


router.
route("/new")
.get(isLoggedIn ,listingController.newr);

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing ,wrapAsync(listingController.savenew));


router
.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.saveedit))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.del));

router
.route("/:id/edit")
.get(isLoggedIn,isOwner,wrapAsync(listingController.editr));





module.exports = router;