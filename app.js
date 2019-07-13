var express         = require('express');
var app             = express();
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var methodOverride  = require('method-override');
var expressSanitizer= require('express-sanitizer');

mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine","ejs");


var blogSchema=new mongoose.Schema({
    title   : String,
    content : String,
    image   : String,
    created : {type: Date, default: Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

//HOME
app.get("/",function (req,res) {
    res.render("home");
})
//INDEX
app.get("/blogs",function (req,res) {
    Blog.find({},function (err,blogs) {
        if(err)
            console.log(err);
        else
            res.render("index",{blogs: blogs});
    });
})

//NEW
app.get("/blogs/new",function(req,res){
    res.render("new");
})

//CREATE
app.post("/blogs",function (req,res) {
    var newBlog=req.body;
    newBlog.content=req.sanitize(newBlog.content);
    Blog.create(newBlog,function (err,blog) {
        if(err)
            console.log(err);
        else
            res.redirect("/blogs");
    });
})

//SHOW
app.get("/blogs/:id",function (req,res) {
    Blog.findById(req.params.id,function (err,blog) {
        if(err)
            console.log(err);
        else
            res.render("show",{blog: blog});
    });
})

//EDIT
app.get("/blogs/:id/edit",function (req,res) {
    Blog.findById(req.params.id,function (err,blog) {
        if(err)
            console.log(err);
        else
            res.render("edit",{blog: blog});
    });
})

//UPDATE
app.put("/blogs/:id",function (req,res) {
    updateBlog=req.body;
    updateBlog.content=req.sanitize(updateBlog.content);
    Blog.findByIdAndUpdate(req.params.id,updateBlog,function (err,blog) {
        if(err)
            console.log(err);
        else
            res.redirect("/blogs");
    });
})

//DELETE
app.delete("/blogs/:id",function (req,res) {
    Blog.findByIdAndRemove(req.params.id,function (err,blog) {
        if(err)
            console.log(err);
        else
            res.redirect("/blogs");
    })
})


app.listen(3000,function () {
    console.log("Blog Server initiated");
})