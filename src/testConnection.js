const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://ramizghada1:6RPjCvcneII4VpxW@cluster0.aboazly.mongodb.net/food-ordering";

export default async function connectToDatabase() {

    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}
connectToDatabase();
