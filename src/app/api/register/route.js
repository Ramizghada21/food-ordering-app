import mongoose from "mongoose";
import { User } from "../../models/user";
import bcrypt from "bcrypt";

async function connectToDatabase() {
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL environment variable is not defined");
    }

    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(process.env.MONGO_URL);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error.message);
            throw error; // Re-throw the error to be caught in the calling function
        }
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        const body = await req.json();
        const pass = body.password;
        if(!pass?.length || pass.length < 8)
        {
            new Error('Password Must be at least 8 character...');
        }
        const notHashedPassword = pass;
        const salt = bcrypt.genSaltSync(10);
        body.password = bcrypt.hashSync(notHashedPassword,salt);
        console.log("Request body:", body);

        const createdUser = await User.create(body);
        console.log("User created:", createdUser);

        return new Response(JSON.stringify(createdUser), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in POST handler:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
