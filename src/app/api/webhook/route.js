const stripe = require('stripe')(process.env.STRIPE_SK);
import Order from "../../models/Order";
// import { buffer } from 'micro';
export async function POST(req) {
    const sig = req.headers.get('stripe-signature');
    let event;
    try
    {
        const reqBuffer=await req.text();
        const signSecret = process.env.STRIPE_SIGN_SECRET;
        event = stripe.webhooks.constuctEvent(reqBuffer,sig,signSecret);
    }
    catch(e)
    {
        console.error('stripe error');
        return Response.json(e,{status:400});
    }
    if (event.type === 'checkout.session.completed') {
        console.log(event);
        
        const orderId = event?.data?.object?.metadata?.orderId;
        const isPaid = event?.data?.object?.payment_status === 'paid';
        
        if (orderId && isPaid) {
            try {
                const updateResult = await Order.updateOne({ _id: orderId }, { paid: true });
                if (updateResult.nModified === 0) {
                    console.log('Order not updated, no matching order found');
                } else {
                    console.log('Order updated successfully');
                }
            } catch (error) {
                console.error('Error updating order:', error);
            }
        } else {
            console.log('Invalid orderId or payment status');
        }
    }
    console.log(event);
    return Response.json('ok',{status:200});
}