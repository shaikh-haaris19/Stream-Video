import { NextRequest, NextResponse } from "next/server";
import { SignUpSchema } from "@/Schemas/SignUpSchema";
import { z } from "zod";
import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/UserModel";

export async function POST(req: NextRequest) {

    try {

        const { email } = await req.json();

        const validateEmail = SignUpSchema.pick({ email: true }).safeParse({ email });

        if (!validateEmail.success) {

            const errors = z.flattenError(validateEmail.error).fieldErrors;
            const emailError = errors.email?.[0];

            return NextResponse.json({ message: emailError || "Invalid email address" }, { status: 400 });
        }

        // Connect to the database & Check if the email already exists
        await connectDB();

        const isEmailTaken = await UserModel.findOne({ email });

        if (isEmailTaken) {
            return NextResponse.json({ message: "User Already Exists With This Email" }, { status: 400 });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {

        console.error(error);
        return NextResponse.json({ message: "Failed to check email uniqueness" }, { status: 500 });

    }

}