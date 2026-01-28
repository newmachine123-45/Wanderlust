let mongoose = require("mongoose");
let Listing=require("../models/listing.js");
let initdata=require("./data.js");

main().then(() => {
    console.log("Connected to db");

}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}

let init=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
        ...obj,
        owner:'695cac6c1bebfcf2ebafc899',
    }));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
    
}
init();