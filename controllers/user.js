const User=require("../models/user.js")

module.exports.signUpUser=(req,res)=>{
    res.render("users/signUp.ejs");
}


module.exports.signupPost=async (req,res)=>{
    try{//we are using try catch here so that if any pre registered user try to signup then we can show a flash that user already exist and we can just send a flash tat the user already exists and redirect to the signup page.
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registerdUser=await User.register(newUser,password);
    // console.log(registerdUser);
    req.login(registerdUser,(err)=>{
        if(err){
            return next(err);
        }

        req.flash("success","Welcome to Wanderlust");//this flash will work as we are already accessing the success in the index.ejs.
    res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.loginGet=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginPost=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";//means if res.locals.redirectUrl this exists then store this in the redirectUrl else store "/listings" and then finally we are redirecting tothe redirecrUrl.
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{//this logout function is due to passport and it takes a callback and here comes err as a parameter.
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
}