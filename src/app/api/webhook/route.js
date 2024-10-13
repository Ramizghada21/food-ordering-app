import { Order } from "../../models/Order";
import mongoose from "mongoose";
const stripe = require("stripe")(process.env.STRIPE_SK);

async function connectToDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected successfully for Stripe webhook");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw new Error("Database connection failed");
    }
  }
}

export async function POST(req) {
  await connectToDB();  // Ensure MongoDB is connected

  const sig = req.headers.get("stripe-signature");
  let event;

  try {
    const reqBuffer = await req.text();  // Get raw body for Stripe verification
    const signSecret = process.env.STRIPE_SIGN_SECRET;

    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);  // Verify the event signature
    console.log("Stripe event verified:", event);

  } catch (e) {
    console.error("Stripe webhook signature verification failed:", e.message);
    return new Response(JSON.stringify({ error: "Webhook signature verification failed" }), { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("Checkout session completed:", session);

    try {
      const orderId = session.metadata?.orderId;
      const isPaid = session.payment_status === "paid";

      if (isPaid && orderId) {
        console.log(`Payment received for order ID: ${orderId}`);

        // Update the order status to paid in the database
        const updatedOrder = await Order.updateOne(
          { _id: orderId },
          { $set: { paid: true } }
        );

        if (updatedOrder.nModified > 0) {
          console.log(`Order ${orderId} updated to paid.`);
        } else {
          console.warn(`Order ${orderId} not found or already updated.`);
        }
      } else {
        console.warn("No valid orderId in session metadata or payment not marked as paid.");
      }
    } catch (error) {
      console.error("Error updating order payment status:", error);
      return new Response(JSON.stringify({ error: "Error updating order" }), { status: 500 });
    }
  }

  // Respond to Stripe to acknowledge receipt of the event
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
