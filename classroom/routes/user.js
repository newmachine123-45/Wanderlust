const express=require("express");
let router=express.Router();

// index-route
router.get("",(req,res)=>{
    res.send("GEt for users");
})

// show-users
router.get("/:id",(req,res)=>{
    res.send("GEt for user id");
})

// post users
router.post("",(req,res)=>{
    res.send("POSt for users");
})

// delete-users
router.delete("/:id",(req,res)=>{
    res.send("Delete for users");
});

module.exports=router;