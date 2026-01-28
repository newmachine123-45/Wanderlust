let Review = require("../models/review.js");
let Listing = require("../models/listing.js");

module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newriview = await new Review(req.body.review); //as we are sending the data in form of a object(review[comment],review[rating]).the newreview will look like this ::
    //     {
    //   comment: 'excellent',
    //   rating: 100,
    //   createdAt: 2025-12-26T15:34:52.795Z,
    //   _id: new ObjectId('694eab242891c7062c2ea811')
    // }
    // console.log(newriview);

    listing.reviews.push(newriview); //as in the listingSchema we have created a array of objects for the reviews.
    newriview.author=req.user._id;
    await newriview.save(); //saving the new created review.
    await listing.save(); //saving the listing as we are inserting the review in it.

    console.log("review send");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  };

  module.exports.deleteReview=async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  }