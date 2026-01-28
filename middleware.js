const Listing = require("./models/listing");
const Review = require("./models/review");
let ExpressError = require("./utils/ExpressError");
let { listingSchema,reviewSchema } = require("./schema"); 
module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;//this req.originalUrl holds the value of the url that we were trying to go to before login.
    req.flash("error","You must be logged in to create new listing!");
   return res.redirect("/login")
  }
  next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();

}

module.exports.isOwner=async(req,res,next)=>{
  let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
       req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
    }
    next();
}

// defining the schema error validation in the separate function for listing.
module.exports.validationListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// defining the schema error validation in the separate function for review.
module.exports.validationReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// middleware for the reviews to see if the user is the owner or not
module.exports.isReviewAuthor=async(req,res,next)=>{
  let { id,reviewid} = req.params;
    let review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currentUser._id)){
       req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
    }
    next();
}
