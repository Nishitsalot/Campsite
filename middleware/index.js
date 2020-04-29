var middlewareObj={};
var Camps= require("../models/campground");
var Comment= require("../models/comment");

middlewareObj.checkOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Camps.findById(req.params.id, function(err , foundCampground){
            if(err){
                req.flash("error" , "Campground not found");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    }
    else{
        req.flash("error" , "You need to be logged in to that");
        res.redirect("back");    
    }
}

middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error" , "You need to be logged in to that");
    res.redirect("/login");
}

middlewareObj.checkAuthor = function (req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id , function(err,comment){
            if(err){
                res.redirect("back");
            }else{

                if(req.user._id.equals(comment.author.id)){
                    next();
                }else{
                    req.flash("error" , "You don't have permission to do that");
                    res.redirect("/campgrounds/"+ req.params.id);
                }
            }
        })
    }else{
        res.redirect("back");
    }
}



module.exports = middlewareObj;