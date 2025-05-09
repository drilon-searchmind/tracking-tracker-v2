import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./mongodb"
import { dbConnect } from "./dbConnect";
import User from "@/models/User";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    // *** MongoDB adapter to persist users (optional)
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.manage.users.readonly https://www.googleapis.com/auth/analytics.edit",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // *** Persist the Google access_token in the JWT
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            // *** Make the access_token available on session
            session.user.accessToken = token.accessToken;
            return session;
        },
    },
    events: {
        async createUser({ user }) {
            try {
                await dbConnect();
                await User.create({
                    googleId: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                });
                console.log("Created new user:", user.email);
            } catch (err) {
                if (err.code === 11000) {
                    console.warn("User already exists, skipping create():", user.email);
                } else {
                    console.error("createUser event error:", err);
                }
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}