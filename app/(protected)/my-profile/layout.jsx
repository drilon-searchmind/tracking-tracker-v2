import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfileLayout({ children }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto">
                {children}
            </div>
        </div>
    );
}