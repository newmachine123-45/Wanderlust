const express=require("express");
let router=express.Router();


// index-route
router.get("",(req,res)=>{
    res.send("GEt for posts");
})

// show-posts
router.get("/:id",(req,res)=>{
    res.send("GEt for post id");
})

// post posts
router.post("",(req,res)=>{
    res.send("POSt for posts");
})

// delete-posts
router.delete("/:id",(req,res)=>{
    res.send("Delete for posts");
});

module.exports=router;