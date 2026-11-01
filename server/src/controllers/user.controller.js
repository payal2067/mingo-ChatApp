import User from "../models/user.model.js";
import Message from "../models/message.model.js";

// Helper to extract clean last 10 digits of mobile number
const cleanMobile = (raw) => {
    if (!raw) return "";
    const digits = String(raw).replace(/\D/g, "");
    return digits.length >= 10 ? digits.slice(-10) : digits;
};

export const getAllUsers = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.user._id).populate(
            "savedContacts.user",
            "-password",
        );

        if (!currentUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        const chatUsers = [];
        const seenUserIds = new Set();

        // 1. Only include users whose contact numbers are saved
        (currentUser.savedContacts || []).forEach((c) => {
            if (c.user && c.user._id) {
                const uObj = c.user.toObject ? c.user.toObject() : c.user;
                const uidStr = uObj._id.toString();
                if (!seenUserIds.has(uidStr) && uidStr !== currentUser._id.toString()) {
                    seenUserIds.add(uidStr);
                    chatUsers.push({
                        ...uObj,
                        displayName: c.contactName || uObj.fullName,
                        savedMobileNumber: c.mobileNumber,
                        isSavedContact: true,
                    });
                }
            }
        });

        // 2. Also keep active conversations where messages have already been exchanged
        const existingMessages = await Message.find({
            $or: [{ senderId: currentUser._id }, { receiverId: currentUser._id }],
        }).select("senderId receiverId");

        const messagedIds = new Set();
        existingMessages.forEach((m) => {
            const other =
                m.senderId?.toString() === currentUser._id.toString()
                    ? m.receiverId?.toString()
                    : m.senderId?.toString();
            if (other && !seenUserIds.has(other) && other !== currentUser._id.toString()) {
                messagedIds.add(other);
            }
        });

        if (messagedIds.size > 0) {
            const extraUsers = await User.find({
                _id: { $in: Array.from(messagedIds) },
            }).select("-password");

            extraUsers.forEach((u) => {
                const uObj = u.toObject();
                chatUsers.push({
                    ...uObj,
                    displayName: uObj.fullName,
                    isSavedContact: false,
                });
            });
        }

        res.status(200).json({ data: chatUsers });
    } catch (error) {
        next(error);
    }
};

export const addContact = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const { mobileNumber, contactName } = req.body;

        if (!mobileNumber || !mobileNumber.trim()) {
            const error = new Error("Mobile number is required");
            error.statusCode = 400;
            return next(error);
        }

        const normalizedInput = cleanMobile(mobileNumber);
        if (normalizedInput.length < 10) {
            const error = new Error("Please enter a valid 10-digit mobile number");
            error.statusCode = 400;
            return next(error);
        }

        const currentNormalized = cleanMobile(currentUser.mobileNumber);
        if (currentNormalized && currentNormalized === normalizedInput) {
            const error = new Error("You cannot add your own mobile number as a contact");
            error.statusCode = 400;
            return next(error);
        }

        // Find registered user whose mobile number ends with the same 10 digits
        const targetUser = await User.findOne({
            _id: { $ne: currentUser._id },
            mobileNumber: { $regex: new RegExp(normalizedInput + "$") },
        }).select("-password");

        if (!targetUser) {
            const error = new Error(
                `No user found with mobile number ${mobileNumber}. Ensure they have registered on Mingo.`,
            );
            error.statusCode = 404;
            return next(error);
        }

        if (!currentUser.savedContacts) {
            currentUser.savedContacts = [];
        }

        const finalName = contactName?.trim() || targetUser.fullName;

        // Check if contact is already saved
        const existingIndex = currentUser.savedContacts.findIndex(
            (c) =>
                c.user?.toString() === targetUser._id.toString() ||
                cleanMobile(c.mobileNumber) === normalizedInput,
        );

        if (existingIndex > -1) {
            currentUser.savedContacts[existingIndex].contactName = finalName;
            currentUser.savedContacts[existingIndex].user = targetUser._id;
            currentUser.savedContacts[existingIndex].mobileNumber = normalizedInput;
        } else {
            currentUser.savedContacts.push({
                user: targetUser._id,
                contactName: finalName,
                mobileNumber: normalizedInput,
            });
        }

        await currentUser.save();

        const responseContact = {
            ...targetUser.toObject(),
            displayName: finalName,
            savedMobileNumber: normalizedInput,
            isSavedContact: true,
        };

        res.status(200).json({
            success: true,
            message: `Contact "${finalName}" added successfully!`,
            data: responseContact,
        });
    } catch (error) {
        next(error);
    }
};

export const removeContact = async (req, res, next) => {
    try {
        const { contactUserId } = req.params;
        const currentUser = await User.findById(req.user._id);

        if (!currentUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        currentUser.savedContacts = (currentUser.savedContacts || []).filter(
            (c) => c.user?.toString() !== contactUserId,
        );

        await currentUser.save();

        res.status(200).json({
            success: true,
            message: "Contact removed from saved list",
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const currentUser = req.user;

        const { fullName, email, mobileNumber } = req.body;

        if (email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: currentUser._id },
            });
            if (existingUser) {
                const error = new Error("Email already in use");
                error.statusCode = 400;
                return next(error);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            {
                ...(fullName && { fullName }),
                ...(email && { email }),
                ...(mobileNumber !== undefined && { mobileNumber }),
            },
            { new: true },
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};
