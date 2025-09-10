import express from "express";
import bodyParser from "body-parser";
import fs, { existsSync } from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const POST_file = "post.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

function readPost(){
    if(!fs.existsSync(POST_file)) return [];
    try{
        const data = fs.readFileSync(POST_file,["utf8"]);
        return data ? JSON.parse(data): [];
    }catch(err){
        console.log("Error reading post.json",err);
        return [];
    }
}

function writePost(posts){
    fs.writeFileSync(POST_file ,JSON.stringify(posts,null,2));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "static", "index.html"));
});

app.get("/home",(req,res)=>{
    const posts = readPost();
    res.render("index.ejs",{posts})
})

app.get('/blogs',(req,res)=>{
    const posts = readPost();
    setTimeout(()=>{
        res.render("blogs.ejs", {posts})
    },1000)
});

app.get("/create",(req,res)=>{
    res.render("create.ejs");
});

app.post('/submit',(req,res)=>{
    const posts = readPost();
    const newPosts = {
        title: req.body.title,
        image: req.body.image, 
        description: req.body.description
    };
    posts.push(newPosts);
    writePost(posts);
    res.redirect('/home');
});

app.post("/delete/:index",(req,res)=>{
    const posts = readPost();
    posts.splice(req.params.index, 1);
    writePost(posts);
    res.redirect("/home")
})

app.use((req, res) => {
    setTimeout(()=>{
        res.status(404).render("404.ejs");
    },1000)
});

app.listen(port,()=>{
    console.log(`This is listening on port ${port}`);
});