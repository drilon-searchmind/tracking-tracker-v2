import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.isAdmin) {
            return new Response(JSON.stringify({ message: "Not authorized" }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await dbConnect();

        const users = await User.find({});

        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return new Response(
                JSON.stringify({ message: "Unauthorized: Only admins can create new users" }),
                { status: 403 }
            );
        }

        await dbConnect();
        
        const body = await request.json();
        const { name, email, password, isAdmin, isExternal } = body;
        
        if (!name || !email || !password) {
            return new Response(
                JSON.stringify({ message: "Name, email, and password are required" }),
                { status: 400 }
            );
        }
        
        if (password.length < 6) {
            return new Response(
                JSON.stringify({ message: "Password must be at least 6 characters long" }),
                { status: 400 }
            );
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ message: "A user with this email already exists" }),
                { status: 409 }
            );
        }
        
        const newUser = new User({
            name,
            email,
            password,
            isAdmin: isAdmin || false,
            isExternal: isExternal || false,
            isArchived: false,
        });
        
        await newUser.save();
        
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            isExternal: newUser.isExternal,
            isArchived: newUser.isArchived,
            createdAt: newUser.createdAt,
        };
        
        return new Response(
            JSON.stringify(userResponse),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return new Response(
            JSON.stringify({ message: "An error occurred while creating the user" }),
            { status: 500 }
        );
    }
}