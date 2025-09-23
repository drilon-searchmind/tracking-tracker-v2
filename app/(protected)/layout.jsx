import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ModalProvider } from "../contexts/CampaignModalContext";

export default async function ProtectedLayout({ children }) {
    let session;
    try {
        session = await getServerSession(authOptions);
        
        // Only log in development
        if (process.env.NODE_ENV !== 'production') {
            console.log("Protected layout - session exists:", !!session);
        }
    } catch (error) {
        console.error("Error retrieving session:", error);
        redirect("/login?error=session_error");
    }

    if (!session) {
        console.log("No session found, redirecting to login");
        redirect("/login");
    }

    return (
        <ModalProvider>
            <div className="min-h-screen bg-base-100">
                <div className="container mx-auto">
                    {children}
                </div>
            </div>
        </ModalProvider>
    );
}