const mongoose = require("mongoose");
let Review=require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    // image: {
    //     type: String,
    //     default: "https://images.unsplash.com/photo-1603766806347-54cdf3745953?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     set: v => {
    //         if (!v) return v;
    //         if (typeof v === 'object' && v.url) return v.url;
    //         return v === "" ? 'https://images.unsplash.com/photo-1603766806347-54cdf3...' : v;
    //     }},
    image: {
    // type: String,
    // default: "https://images.unsplash.com/photo-1603766806347-54cdf3745953?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    // set: v => {
    //     if (v === "") return undefined;   // 👈 KEY FIX
    //     if (typeof v === "object" && v.url) return v.url;
    //     return v;
    //  },
    url:String,
    filename:String,
   
},
        price: {
            type: Number,
        },
        location: {
            type: String,
        },
        country: {
            type: String,
        },
        reviews:[{//this is the way of storing a different model ina differrnt model.
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }],
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },

        // adding category for the filter options to work
        category: {
  type: String,
  enum: [
    "Trending",
    "Rooms",
    "Iconic City",
    "Mountains",
    "Castles",
    "Amazing Pools",
    "Camping",
    "Farm",
    "Snow"
  ],
  required: true
}

       

    });

    listingSchema.post("findOneAndDelete",async(listing)=>{
        if(listing){
            await Review.deleteMany({_id:{$in:listing.reviews}});
        };
    })

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;