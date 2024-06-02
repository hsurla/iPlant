import express from "express";
import bodyParser from "body-parser";
import { dirname, join } from "path";
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

// Define schema for cart items
const cartItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  userId: mongoose.Schema.Types.ObjectId,
});

// Create models based on the schemas
const User = mongoose.model("User", userSchema);
const CartItem = mongoose.model("CartItem", cartItemSchema);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "public", "signup.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(join(__dirname, "public", "login.html"));
});

app.post("/submit", async (req, res) => {
    console.log("Received signup form submission:");
    console.log(req.body);  // Log the request body to see the submitted data

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
        await newUser.save();
        console.log("Data saved successfully.");
        res.redirect("/login");
        
    } catch (error) {
        console.error(error);
        res.send("Error occurred while saving the data.");
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            // Serve iPlant.html from the 'public' directory
            res.redirect(`/iPlant.html?firstName=${user.firstName}`);
        } else {
            res.send("Invalid email or password.");
        }
    } catch (error) {
        console.error(error);
        res.send("Error occurred while logging in.");
    }
});

// New route to handle payment data submission
app.post("/submit-payment", async (req, res) => {
    const { cartItems, paymentData } = req.body;

    try {
        // Save payment data to the database
        // Example: Assuming you have a Payment model
        // const newPayment = new Payment(paymentData);
        // await newPayment.save();

        // Save cart items to the database
        for (const item of cartItems) {
            const newCartItem = new CartItem({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                // Add userId or other relevant properties if needed
            });
            await newCartItem.save();
        }

        res.sendFile(join(__dirname, "public", "order_confirmation.html"));
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while saving payment data.");
    }
});

app.post("/book", async (req, res) => {
    const { date, time, nursery, service } = req.body;

    try {
        // Save booking data to the database
        // Example: Assuming you have a Booking model
        // const newBooking = new Booking({ date, time, nursery, service });
        // await newBooking.save();

        // For now, let's just send a confirmation response
        res.send("Booking Successful");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while booking.");
    }
});


app.listen(port, () => {
    console.log(`Running on port ${port}.`);
});
