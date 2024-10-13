import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Order } from "../../models/Order";

// Utility function to connect to MongoDB
async function connectToDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw new Error("Database connection failed");
    }
  }
}

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch the session data
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    console.log("User Email:", userEmail);

    if (!userEmail) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    // Parse query parameters from the request URL
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');

    // Fetch a specific order by its ID
    if (_id) {
      const order = await Order.findById(_id);
      if (!order) {
        return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
      }

      // Ensure the order belongs to the logged-in user
      if (order.userEmail !== userEmail) {
        return new Response(JSON.stringify({ message: "Unauthorized access" }), { status: 403 });
      }

      return new Response(JSON.stringify(order), { status: 200 });
    }

    // Fetch all orders for the logged-in user
    const userOrders = await Order.find({ userEmail });
    return new Response(JSON.stringify(userOrders), { status: 200 });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
  }
}
