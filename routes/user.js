let express = require("express");
let router = express.Router();
const User=require("../models/user.js")
let wrapAsync=require("../utils/wrapAsync");
let passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");

const userController=require("../controllers/user.js");

// signUp get request
// router.get("/signup",userController.signUpUser)

// signup post request
// router.post("/signup",wrapAsync(userController.signupPost));

// login get request
// router.get("/login",userController.loginGet);

// login post request
// router.post("/login",saveRedirectUrl,
//     passport.authenticate("local",{
//     failureRedirect:"/login",
//     failureFlash:true,
// }),userController.loginPost);

// // logout route
// router.get("/logout",userController.logout)


// using the router.route
router.route("/signup")
.get(userController.signUpUser)
.post(wrapAsync(userController.signupPost));

router.route("/login")
.get(userController.loginGet)
.post(saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),userController.loginPost);

// logout route
router.get("/logout",userController.logout)


module.exports=router;