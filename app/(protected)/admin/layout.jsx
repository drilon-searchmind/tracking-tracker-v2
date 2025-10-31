import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ModalProvider } from "@/app/contexts/CampaignModalContext";
import UnauthorizedAccess from "@/app/components/UI/UnauthorizedAccess";

export default async function AdminLayout({ children }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const isAdmin = session?.user?.isAdmin === true;
    
    if (!isAdmin) {
        return <UnauthorizedAccess message="You do not have administrator privileges to access this page." />;
    }

    return (
        <ModalProvider>
            <div className="min-h-screen">
                <div className="container mx-auto">
                    {children}
                </div>
            </div>
        </ModalProvider>
    );
}