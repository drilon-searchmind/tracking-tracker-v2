import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await req.json();
        const { userId, name, email, currentPassword, newPassword } = body;

        if (session.user.id !== userId) {
            return new Response(JSON.stringify({ message: "You can only update your own profile" }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await dbConnect();

        const user = await User.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (currentPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return new Response(JSON.stringify({ message: "Current password is incorrect" }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            user.password = newPassword;
        }

        if (name) {
            user.name = name;
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return new Response(JSON.stringify({ message: "Email is already in use" }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            user.email = email;
        }

        await user.save();

        const userResponse = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin || false
        };

        return new Response(JSON.stringify(userResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return new Response(JSON.stringify({ message: error.message || "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}