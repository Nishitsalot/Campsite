var express= require("express");
var router = express.Router({mergeParams: true});
var Camps = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new" ,middleware.isLoggedIn ,  function(req,res){

    Camps.findById(req.params.id , function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new" , {campgrounds:campground});
        }
    })
})

router.post("/" ,middleware.isLoggedIn , function(req,res){
    Camps.findById(req.params.id , function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment , function(err,comment){
                if(err){
                    req.flash("error" , "Something went wrong");
                    console.log(err);
                }else{
                    comment.author.id = req.user._id ;
                    comment.author.username = req.user.username ;
                    comment.save();

                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success" , "Successfully added your comment");
                    res.redirect("/campgrounds/" + campground._id );

                }
            })
        }
    })
});


router.get("/:comment_id/edit" ,middleware.checkAuthor, function(req,res){
    Comment.findById(req.params.comment_id , function(err,comment){
        res.render("comments/edit" , {camps : req.params.id ,comment:comment });
    })
    
    
});

router.put("/:comment_id" ,middleware.checkAuthor, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment , function(err, updatedComment){
        if(err){
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            req.flash("success" , "Successfully updated your comment");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

router.delete("/:comment_id" , middleware.checkAuthor, function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id , function(err){
        if(err){
            res.redirect("/campgrounds/"+req.params.id);
        }
        req.flash("success" , "Comment deleted successfully !!");
        res.redirect("/campgrounds/"+req.params.id);
    })
})

module.exports = router ;