let express = require("express");
let app = express();
let users=require("./routes/user.js");
let posts=require("./routes/post.js");
let cookieParser=require("cookie-parser");
// app.use(cookieParser());
app.use(cookieParser("secretcode"));//for signed cookies

// to use the express session
const session=require("express-session");
// suing flash
const flash=require("connect-flash");


//  sending cookies
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("MadeIN","IndIa");
//     res.send("we sentyou some cookies!");
// })

// // using the cookie parser=>so to read the values from the or to print them we need cookie parser.
// app.get("/getcookie",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("cookies");
// }) 

// app.get("/getcookiess",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`hi,${name}`);
// }) 

// // signed  cookies
// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie sent!");
// })

// // to verify
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified!");
// })


// // root route 
// app.get("/",(req,res)=>{
//     res.send("Hi, I am root!");
// })

// app.use("/users",users);
// app.use("/posts",posts);


// to use the express cookies
app.use(session({secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
}));
// app.get("/test",(req,res)=>{
//     res.send("hhh");
// })

// app.use("/requestCount",(req,res)=>{
//     if(req.session.count){//req.session tracks a single session and if we want to track the no. of requests then for that we made the count variable.so here if req.session.count exists then increase the req.sesssion.count by 1 else set=1.
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// })

// using the name in two paths by saving them in the as req.session.name.
// app.get("/register",(req,res)=>{
//     let {name="anonymous"}=req.query;
//     req.session.name=name;
//     res.send(name);
// })
// app.get("/hello",(req,res)=>{
//     res.send(`hi,${req.session.name}`);//accessing the name here that we specified in the query of the "/register" path by using the req.session.query.
// })


// using flash
let path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(flash());
app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("error","user not registerd");
    }else{
        req.flash("success","user registerd successfully!");
    }
    res.redirect("/hello");
})

// sending the res.locals from the middleware
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
})
app.get("/hello",(req,res)=>{
    // res.render("page.ejs",{name:req.session.name, msg:req.flash("success")});//accessing the name here that we specified in the query of the "/register" path by using the req.session.query.

    // using the res.locals
    // res.locals.successMsg=req.flash("success");
    // res.locals.errorMsg=req.flash("error");//we can also send this from a middleware
    res.render("page.ejs",{name:req.session.name});
})


app.listen(3000,()=>{
    console.log("connected");
})