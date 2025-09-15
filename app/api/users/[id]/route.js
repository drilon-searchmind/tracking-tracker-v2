import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.isAdmin) {
            return new Response(JSON.stringify({ message: "Not authorized" }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const userId = params.id;
        const { name, email, isAdmin, password, isArchived } = await req.json();

        await dbConnect();

        const updateData = {
            name,
            email,
            isAdmin,
            isArchived
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { 
                new: true, // Return the updated document
                runValidators: false // Don't validate fields that aren't being updated
            }
        );

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const userData = user.toObject();
        delete userData.password;

        return new Response(JSON.stringify(userData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ message: error.message || "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}