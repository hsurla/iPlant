import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/signup.html");
  });

  app.post("/submit",(req,res)=>{
    console.log(req.body);
    res.redirect("/");
});


app.listen(port,()=>{
    console.log(`running on port ${port}.`);
})