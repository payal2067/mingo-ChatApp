import { generateToken } from "../config/authToken.config.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import OTP from "../models/otp.model.js";
import { sendOTPEmail } from "../utils/email.util.js";

// ================= REGISTER =================
export const UserRegister = async (req, res, next) => {
    try {
        let { fullName, email, mobileNumber, password } = req.body;

        if (!fullName || !email || !mobileNumber || !password) {
            const error = new Error("All fields required");
            error.statusCode = 400;
            return next(error);
        }

        email = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("Email already exists");
            error.statusCode = 400;
            return next(error);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            fullName,
            email,
            mobileNumber,
            password: hashedPassword,
        });

        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        next(error);
    }
};

// ================= LOGIN =================
export const UserLogin = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("All fields required");
            error.statusCode = 400;
            return next(error);
        }

        email = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            const error = new Error("Email not registered");
            error.statusCode = 400;
            return next(error);
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            const error = new Error("Password did not match");
            error.statusCode = 400;
            return next(error);
        }

        generateToken(existingUser._id, res);

        const userData = existingUser.toObject();
        delete userData.password;

        res.status(200).json({
            message: "Login successful",
            data: userData,
        });
    } catch (error) {
        next(error);
    }
};

// ================= FORGOT PASSWORD =================
export const UserForgotPassword = async (req, res, next) => {
    try {
        let { email } = req.body;

        if (!email) {
            const error = new Error("Email is required");
            error.statusCode = 400;
            return next(error);
        }

        email = email.trim().toLowerCase();

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User with this email does not exist");
            error.statusCode = 404;
            return next(error);
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing OTPs for this email to avoid conflicts
        await OTP.deleteMany({ email });

        // Save new OTP
        await OTP.create({ email, otp });

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        next(error);
    }
};

// ================= VERIFY OTP =================
export const UserVerifyOTP = async (req, res, next) => {
    try {
        let { email, otp } = req.body;

        if (!email || !otp) {
            const error = new Error("Email and OTP are required");
            error.statusCode = 400;
            return next(error);
        }

        email = email.trim().toLowerCase();

        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            const error = new Error("Invalid or expired OTP");
            error.statusCode = 400;
            return next(error);
        }

        // OTP is valid, delete it
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        next(error);
    }
};
