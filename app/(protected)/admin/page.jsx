import Image from "next/image";
import AdminAccordionTab from "./admin-components/AdminAccordionTab";
import Subheading from "@/app/components/UI/Utility/Subheading";

export default function AdminPage() {
    return (
        <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-t from-white to-[var(--color-natural)] rounded-lg z-1"></div>
            <div className="absolute bottom-[-355px] left-0 w-full h-full z-1">
                <Image
                    width={1920}
                    height={1080}
                    src="/images/shape-dotted-light.svg"
                    alt="bg"
                    className="w-full h-full"
                />
            </div>

            <div className="px-0 md:px-20 mx-auto z-10 relative">
                <div className="mb-6 md:mb-8">
                    <Subheading headingText="Admin Panel" />
                    <h1 className="mb-3 md:mb-5 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px]">
                        System Administration
                    </h1>
                    <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                        Manage users, customers, system settings, and monitor activity logs from this centralized admin dashboard.
                    </p>
                </div>

                <AdminAccordionTab />
            </div>
        </div>
    )
}
