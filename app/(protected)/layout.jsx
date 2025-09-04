import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ModalProvider } from "../contexts/CampaignModalContext";

export default async function ProtectedLayout({ children }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/")
    }

    return (
        <ModalProvider>
            <div className="min-h-screen bg-base-100">
                <div className="container mx-auto">
                    {children}
                </div>
            </div>
        </ModalProvider>
    )
}