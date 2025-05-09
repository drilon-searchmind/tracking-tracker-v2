import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/")
    }

    return (
        <div className="min-h-screen bg-base-100">
            <div className="container mx-auto p-6">
                {children}
            </div>
        </div>
    )
}