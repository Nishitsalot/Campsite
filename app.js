var express          = require('express');
var app              = express();
var bodyParser       = require("body-parser");
var mongoose         = require("mongoose");
var methodOverride   = require("method-override");
var Camps            = require("./models/campground");
var Comment          = require("./models/comment");
var seedDB           = require("./seeds");
var passport         = require("passport");
var localStrategy    = require("passport-local");
var User             = require("./models/user");
var flash            = require("connect-flash");

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");
    
//seedDB();
mongoose.connect("mongodb://localhost/My_Camps" , { useNewUrlParser: true , useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT SETUP ****
app.use(require("express-session")({
    secret: "Nishit salot is making this" ,
    resave : false ,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error  = req.flash("error");
    res.locals.success  = req.flash("success");
    next();
});

app.use("/campgrounds" , campgroundRoutes);
app.use("/campgrounds/:id/comments" , commentRoutes);
app.use(indexRoutes);

app.listen(3000,function(){
    console.log("server started");
})