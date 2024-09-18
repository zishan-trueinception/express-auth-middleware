import mongoose, { Document, Schema, Model } from 'mongoose';
import { z } from 'zod';

// Define Zod schema for validation
const userSchemaZod = z.object({
    username: z.string().min(3, "username must be at least 3 characters").max(20, "username must be less than 20 characters"),
    email: z.string().email("Invalid Email Format").min(6, "email must be at least 6 characters").max(50, "email must be less than 50 characters"),  
    password: z.string().min(6, "password must be at least 6 characters").max(20, "password must be less than 20 characters"), 
    address: z.array(z.string()).min(3, "address must be at least 3 characters").max(100, "address must be less than 100 characters"),
    phone: z.string().min(10, "phone number must be at least 10 characters").max(15, "phone number must be less than 15 characters"),
    usertype: z.enum(["user", "admin"]),
    profile: z.string().url().optional(),
    answer: z.string().min(3, "answer must be at least 3 characters").max(50, "answer must be less than 50 characters"),
    isVerified: z.boolean().default(false),
    verifyToken: z.string().nullable(),
});

// Type for userSchema based on Zod schema
export type UserZod = z.infer<typeof userSchemaZod>;

// Interface for user Document
export interface IUser extends Document, UserZod {}

// Define the Mongoose Schema for User
const userSchema: Schema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "username is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    address: {
        type: [String],  // address is an array of strings
    },
    phone: {
        type: String,
        required: [true, "phone number is required"],
    },
    usertype: {
        type: String,
        required: [true, "user type is required"],
        default: "user",
        enum: ["user", "admin"],
    },
    profile: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
    },
    answer: {
        type: String,
        required: [true, "answer is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyToken: {
        type: String,
        default: null,
    },
}, 
{ timestamps: true });

// Function to validate data using Zod
export const validateUserData = (data: unknown) => {
    return userSchemaZod.safeParse(data);  // Use Zod schema for validation
};

// Export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;