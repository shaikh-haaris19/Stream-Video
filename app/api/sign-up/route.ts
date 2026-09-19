import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/UserModel";
import { SignUpSchema } from "@/Schemas/SignUpSchema";
import { z } from "zod";

export async function POST(req: NextRequest) {

    try {

        const { email, password, confirmPassword } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        //Validate email and password Using Zod
        const validateBody = SignUpSchema.safeParse({ email, password, confirmPassword });

        if (!validateBody.success) {
            const errors = z.flattenError(validateBody.error).fieldErrors

            const emailError = errors.email?.[0];
            const passwordError = errors.password?.[0];
            const confirmPasswordError = errors.confirmPassword?.[0];

            return NextResponse.json({ error: emailError || passwordError || confirmPasswordError }, { status: 400 });
        }

        //Connect to the database
        await connectDB();

        //Check if the user already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        //Create a new user 
        const newUser = new UserModel({ email, password });
        await newUser.save();

        return NextResponse.json({ success: true, message: "User created successfully" }, { status: 201 });

    } catch (error) {

        console.error(error);
        return NextResponse.json({ error: "Failed to Register User" }, { status: 500 });

    }

}