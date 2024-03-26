import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public')); // Serve static files from the 'public' directory

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/signup.html");
});

app.post("/submit",(req,res)=>{
    console.log(req.body);
    // Redirect to iPlant.html upon form submission
    res.redirect("/iPlant.html");
});

app.listen(port,()=>{
    console.log(`running on port ${port}.`);
});
