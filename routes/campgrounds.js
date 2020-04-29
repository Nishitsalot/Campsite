var express= require("express");
var router = express.Router();
var Camps = require("../models/campground");
var middleware = require("../middleware");


router.get("/" , function(req,res){
    
    Camps.find({},function(err,campgrounds){
        res.render("campgrounds/index" , {campgrounds:campgrounds});
    })

    
});

router.post("/", middleware.isLoggedIn , function(req,res){
    var name = req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author = {
        id: req.user._id,
        username : req.user.username
    }
    var camp={name: name , image: image , description:description , author : author};
    Camps.create(camp, function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            req.flash("success" , "Campground added successfully");
            res.redirect("/campgrounds");
        }
    })
});

router.get("/new" , middleware.isLoggedIn , function(req,res){
    res.render("campgrounds/new");
})

router.get("/:id" , function(req,res){
    Camps.findById(req.params.id).populate("comments").exec(function(err,campsite){
        if(err){
            console.log(err);
        }else{
            // console.log(campsite);
            Camps.find({}, function(err , allCamps){
                res.render("campgrounds/show" , {camp: campsite , allCamps:allCamps});

            })
        }
    });
    
});

router.get("/:id/edit" , middleware.checkOwner , function(req,res){
    Camps.findById(req.params.id , function(err , foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit" , {campground : foundCampground});
        }
    });
});

router.put("/:id" ,middleware.checkOwner ,  function(req,res){
    Camps.findByIdAndUpdate(req.params.id ,req.body.campground , function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash("success" , "Campground updated successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});


router.delete("/:id" ,middleware.checkOwner ,  function(req,res){
    Camps.findByIdAndDelete(req.params.id , function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        req.flash("success" , "Campground deleted successfully !!");
        res.redirect("/campgrounds");
    })
})



module.exports = router ;