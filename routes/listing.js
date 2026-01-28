let express = require("express");
let router = express.Router();
let Listing = require("../models/listing.js");
let { reviewSchema } = require("../schema");
let wrapAsync = require("../utils/wrapAsync");
let ExpressError = require("../utils/ExpressError");
let { listingSchema } = require("../schema");
let {isLoggedIn,validationListing,validationReview,isOwner}=require("../middleware.js");


const ListingContoller=require("../controllers/listing.js");//accessing the listing contoller so that we can use the async function of the index route. 

// using multer
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
// const upload=multer({dest:"uploads/"});//from this multer was storing the file/image in the uploads folder but we want to store them in the cloud storage so we will use the below line instead. 
const upload=multer({storage});

// index route
// router.get(
//   "/",
//   wrapAsync(ListingContoller.index)//accessing the async here.
// );

// create new route
// router.get("/new",isLoggedIn,ListingContoller.renderNewFrom );



// show route
// router.get(
//   "/:id",
//   wrapAsync(ListingContoller.showListing)
// );

// edit route
// router.get(
//   "/:id/edit",isLoggedIn,isOwner,
//   wrapAsync(ListingContoller.renderEditForm)
// );
 
// put
// router.put(
//   "/:id",isLoggedIn,isOwner,
//   validationListing,
//   wrapAsync(ListingContoller.putListing)
// );

// post
// router.post(
//   "/",isLoggedIn,
//   validationListing,
//   wrapAsync(ListingContoller.postListing)
// );

// delete route
// router.delete(
//   "/:id",isLoggedIn,isOwner,
//   wrapAsync(ListingContoller.deleteListing)
// );

// using the router.route
router.route("/")
.get(
  wrapAsync(ListingContoller.index)//accessing the async here.
)
.post(
 isLoggedIn,
 upload.single("listing[image]"),
 validationListing,
 wrapAsync(ListingContoller.postListing)
);
// .post(upload.single("listing[image]"),(req,res)=>{
//   res.send(req.file);
// })

// create new route
router.get("/new",isLoggedIn,ListingContoller.renderNewFrom );

router.route("/:id")
.get(
  wrapAsync(ListingContoller.showListing)
)
.put(
  isLoggedIn,isOwner,
  upload.single("listing[image]"),
  validationListing,
  wrapAsync(ListingContoller.putListing)
)
.delete(
  isLoggedIn,isOwner,
  wrapAsync(ListingContoller.deleteListing)
);


// edit route
router.get(
  "/:id/edit",isLoggedIn,isOwner,
  wrapAsync(ListingContoller.renderEditForm)
);

module.exports = router;
