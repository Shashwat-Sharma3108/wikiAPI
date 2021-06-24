const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('Sview engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB",{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify : false
});

const Schema = new mongoose.Schema({
    title : {
        required : true,
        type : String
    },
    content : {
        required : true,
        type : String
    }
});

const Item = new mongoose.model('Article' , Schema);

app.route("/articles")
    .get((req,res)=>{
        Item.find( (err,result)=>{
            if(err){
                res.send(err);
            }else{
                res.send(result);
            }
        });
    })
    .post((req,res)=>{
        const title = (req.body.title);
        const content = (req.body.content);
    
        const item = new Item({
            title : title,
            content : content
        });
        item.save((err)=>{
            if(err){
                console.log("Error in saving new data : "+err);
            }else{
                console.log("Data inserted successfully!");
                res.redirect("/articles");
            }
        });
    })
    .delete((req,res)=>{
        Item.deleteMany((err)=>{
            if(err){
                console.log("Error in deleting a file " +err);
            }else{
                res.send("Deleted Successfully!");
            }
        });
    });


app.route("/articles/:articleTitle")
    .get((req,res)=>{
        Item.findOne({title : req.params.articleTitle} , (err,result)=>{
            if(err){
                console.log("Error in finding document requested by user! "+err);
            }if(!result){
                res.send("Sorry Better luck next time!");
            }
            else{
                res.send(result);
            }
        })
    })
    .put((req,res)=>{
        console.log(req.params.articleTitle);
        // console.log(req.body.title);
        // console.log(req.body.content);
        Item.findOneAndUpdate(
            {title : req.params.articleTitle},
            {
                title : req.body.title, 
                content : req.body.content
            },
            (err,result)=>{
                if(err){
                    console.log("Error in updating "+err);
                }else if(!result){
                    res.send("No matches found for your search criteria!");
                }else{
                    res.send("Updated Successfully!");
                }
            }
        )
    })
    .patch((req,res)=>{
        Item.findOneAndUpdate(
            {title : req.params.articleTitle},
            {$set: req.body},
            (err,result)=>{
                if(err){
                    console.log("Error in updating a specific thing "+err);
                }else if(!result){
                    res.send("No matches found for your search criteria!");
                }else{
                    res.send("Updated Successfully!");
                }
            }
        )
    })
    .delete((req,res)=>{
        Item.findOneAndDelete(
            {title : req.params.articleTitle},
            (err,result)=>{
                if(err){
                    console.log("Error in deleting an article "+err);
                }else if(!result){
                    res.send("No matches found for your search criteria!");
                }else{
                    res.send("Deleted Successfully!");
                }
            }
        )
    });

app.listen("3000" , (req,res)=>{
    console.log("Server started at port 3000");
})