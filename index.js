if(process.env.NODE_ENV != "production"){//if processin environment is not equal to the production then only we are goin to sue the .env otherwise not.
require("dotenv").config();
}


let express = require("express");
let app = express();
let mongoose = require("mongoose");
let Listing = require("./models/listing.js");
let path = require("path");
let methodOverride = require("method-override");
let ejsMate = require("ejs-mate");
let wrapAsync = require("./utils/wrapAsync");
let ExpressError = require("./utils/ExpressError");
let { listingSchema } = require("./schema");
let Review = require("./models/review.js");
let { reviewSchema } = require("./schema");

let listings = require("./routes/listing.js");
let reviews = require("./routes/review.js");
let user = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const dbUrl=process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => console.log(err));

   // await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");//this line will bw in the async function main() before we start using the mongodb atlas.
  // now as we are using the mongo atlas then we are going to use the below url.
async function main() {
  
  await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  secret: "mysupersecretstring",
  touchAfter: 24 * 3600
});

store.on("error",()=>{
  console.log("Error in mongo session store",err);
})

let sessionOptions = {
  store,
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// middleware for the flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser=req.user;
  next();
});

// /creating a demo user for the testing of the passport
app.get("/demouser",async (req,res)=>{
  let fakeuser=new User({
    email:"neeraj@gmail.com",
    username:"Neeraj",//in  userSchema we were not using username but still we can pass here username as passport creates username and password automatically.
  })

  let newUser=await User.register(fakeuser,"hello World");
  res.send(newUser);
})


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// app.get('/testListing',async (req,res)=>{
//     let newlisting=new Listing({//as the models are a class then we have to make a object to insert values into it.
//         title:"House 101",
//         description:"Sacred Place",
//         image:"https://images.unsplash.com/photo-1603766806347-54cdf3745953?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         price:12000,
//         location:"rajasthan",
//         country:"India"
//     })
//     await newlisting.save();
//     res.send("done");

// })

//using the listings here
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

app.get("/", (req, res) => {
  res.redirect("/listings");
});


// creating custom error handler
// app.use((err,req,res,next)=>{
//     res.send("something went wrong!");
// });

//using custom ExpressError
// * means first match with all the incoming requests if not matched then send the error.
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "something went wrong!" } = err;
  // res.status(statuscode).send(message);

  // now we will render the error.ejs for sending the errors.
  res.status(statuscode).render("error.ejs", { message });
});

// app.use((err, req, res, next) => {
//   console.log("ERROR HANDLER HIT");
//   console.log(err);
//   if (res.headersSent) {
//     return next(err);
//   }
//   res.status(500).render("error.ejs", { message: err.message });
// });


let port = 8080;
app.listen(port, (req, res) => {
  console.log("listening");
});
