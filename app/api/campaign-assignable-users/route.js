import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(JSON.stringify({ message: "Not authorized" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await dbConnect();

        const users = await User.find(
            { isArchived: { $ne: true } },
            { _id: 1, name: 1, email: 1 }
        );

        return new Response(JSON.stringify(users.map(user => ({
            id: user._id.toString(), 
            _id: user._id.toString(),
            name: user.name,
            email: user.email
        }))), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error fetching assignable users:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}