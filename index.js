import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app=express();
const port=3000;
let blogs=[];

try{
    const data= fs.readFileSync("blogs.json");
    blogs=JSON.parse(data);
}
catch(err){
  console.log("Blogs.json is empty.");
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

function saveBlogs() {
  fs.writeFileSync("blogs.json", JSON.stringify(blogs, null, 2));
}

app.get("/",(req,res)=>{
        res.render("index.ejs");
});
app.get("/create",(req,res)=>{
    res.render("create.ejs");
});
app.get("/view",(req,res)=>{
    res.render("view.ejs",{blogData : blogs});
});
app.post("/save",(req,res)=>{
    const newBlog = {
    id: Date.now(),
    title: req.body.title,
    author:req.body.author,
    content: req.body.content,
  };
  blogs.push(newBlog);
  saveBlogs();
  res.redirect("/");
  res.render("index.ejs");
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;

  const blog = blogs.find(b => b.id == id);
  res.render("edit.ejs",{blog});
});

app.post("/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const blog = blogs.find(b => b.id == id);
  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.content = req.body.content;
  saveBlogs();
  res.render("index.ejs");
});

app.post("/delete/:id",(req,res)=>{
  const id= Number(req.params.id);
  blogs = blogs.filter(blog => blog.id !== id);
  saveBlogs();
  res.redirect("/view");
  res.render("view.ejs",{blogData:blogs});
});

app.listen(port, ()=>{
    console.log("Listening on port 3000!");
});
