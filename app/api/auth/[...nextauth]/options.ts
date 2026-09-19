import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {

    providers: [

        CredentialsProvider({

            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text", placeholder: "user@example.com" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                try {

                    await connectDB();

                    const user = await UserModel.findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                    }

                } catch (error) {
                    console.error(error)
                    throw error;
                }
            }
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        })

    ],

    callbacks: {

        async jwt({ token, user }) {

            if (user) {
                token.id = user.id as string;
            }
            return token;
        },

        async session({ session, token }) {

            if (session.user && token) {
                session.user.id = token.id as string;
            }

            return session;
        },

    },

    pages: {
        signIn: "/sign-in",
        error: "/sign-in",
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,

}