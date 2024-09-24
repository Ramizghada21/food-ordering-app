import { model, models, Schema } from "mongoose";

const UserInfoSchema = new Schema({
    email: { type: String, required: true },
    city: { type: String },
    streetAddress: { type: String },
    phone: { type: String },
    postalCode: { type: String },
    country: { type: String },
    admin: { type: Boolean, default: false }, // Corrected from "amin" to "admin"
}, { timestamps: true });

export const UserInfo = models?.UserInfo || model('UserInfo', UserInfoSchema);
