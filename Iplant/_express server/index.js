import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://localhost:27017/plantDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema for user data
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobileNumber: String,
  email: String,
  password: String,
  pincode: String,
  address: String,
});

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/signup.html");
});

app.post("/submit", async (req, res) => {
    // Create a new user instance
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        password: req.body.password,
        pincode: req.body.pincode,
        address: req.body.address,
    });

    try {
        // Save the user data to the database
        await newUser.save();
        console.log("Data saved successfully.");
        // Redirect to iPlant.html upon successful form submission
        res.redirect("/iPlant.html");
    } catch (error) {
        console.error(error);
        res.send("Error occurred while saving the data.");
    }
});

app.listen(port, () => {
    console.log(`running on port ${port}.`);
});
