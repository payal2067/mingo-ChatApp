import mongoose from "mongoose";

const savedContactSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        contactName: {
            type: String,
            trim: true,
        },
        mobileNumber: {
            type: String,
            required: true,
            trim: true,
        },
        savedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true },
);

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobileNumber: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        savedContacts: [savedContactSchema],
        blockedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
