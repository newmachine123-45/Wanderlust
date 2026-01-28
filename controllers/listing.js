const Listing=require("../models/listing");
// module.exports.index=async (req, res) => {
//     let listings = await Listing.find();
//     res.render("listings/index.ejs", { listings });
//   }
// the above code after implemeting search option will look like this.
module.exports.index = async (req, res) => {
  const { q, category } = req.query;

  let query = {};

  // search
  if (q) {
    query.$or = [
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ];
  }

  // category filter
  if (category) {
    query.category = category;
  }

  const listings = await Listing.find(query);
  res.render("listings/index.ejs", { listings });
};




  module.exports.renderNewFrom=(req, res) => {
  // console.log(req.user);
  res.render("listings/new.ejs");
  //  res.send("hiii");
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate({
      path:"reviews",
      populate:{
        path:"author",
      }
    }).populate("owner");
    if(!list){
      req.flash("error","Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
  };

  module.exports.postListing=async (req, res, next) => {
    // let newlisting=new Listing(req.body.listing);//here we are creating a new instance of the model Listing and passing the object with its key value pair.as here listing={title:,etc}.
    // await newlisting.save();
    // res.redirect("/listings");

    // custom error handling
    // try{
    //     let newlisting=new Listing(req.body.listing);//here we are creating a new instance of the model Listing and passing the object with its key value pair.as here listing={title:,etc}.
    // await newlisting.save();
    // res.redirect("/listings");
    // }catch(err){
    //     next(err);
    // }

    // using the wrapAsync
    // custom error handling
    //  if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listig");

    // }

    // now do it by joi schema
    //  let result=listingSchema.validate(req.body);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }we will not use this once we pass the validationListing in the middleware here.

    let url=req.file.path;
    let filename=req.file.filename;

    let newlisting = new Listing(req.body.listing); //here we are creating a new instance of the model Listing and passing the object with its key value pair.as here listing={title:,etc}.
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  };

  module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // changing the original image url
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_250,w_250");
    res.render("listings/edit.ejs", { listing ,originalImageUrl});
  };

  module.exports.putListing=async (req, res) => {
    // let result=listingSchema.validate(req.body);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }we will not use this once we pass the validationListing in the middleware here.
    let { id } = req.params;  
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){//if we are not giving any image while editing then we dont have to do these things. 
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect("/listings");
  };

  module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  };