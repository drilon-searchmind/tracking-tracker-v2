import { dbConnect } from "@/lib/dbConnect";
import CustomerSharings from "@/models/CustomerSharings";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const email = url.searchParams.get('email');

        if (!email) {
            return new Response(JSON.stringify({ message: "Email parameter is required" }), { status: 400 });
        }

        await dbConnect();

        console.log(`Looking for sharings with email: ${email}`);
        const sharings = await CustomerSharings.find({ email });
        console.log(`Found ${sharings.length} sharings for email: ${email}`);

        return new Response(JSON.stringify({ data: sharings }), { status: 200 });
    } catch (error) {
        console.error("Error fetching customer sharings by email:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}