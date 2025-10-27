import Image from "next/image";
import AdminAccordionTab from "./admin-components/AdminAccordionTab";
import Subheading from "@/app/components/UI/Utility/Subheading";

export default function AdminPage() {
    return (
        <section id="pageAdminPage" className="">
            <div className="py-20 px-0 relative overflow">
                <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-t from-white to-[#f8fafc] rounded-lg z-1"></div>
                <div className="absolute bottom-[-355px] left-0 w-full h-full z-1">
                    <Image
                        width={1920}
                        height={1080}
                        src="/images/shape-dotted-light.svg"
                        alt="bg"
                        className="w-full h-full"
                    />
                </div>

                <div className="px-20 mx-auto z-10 relative">
                    <div className="mb-8">
                        <Subheading headingText="Admin Page" />
                        <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px] inline-grid z-10">Admin Dashboard Overview</h1>
                        <p className="text-gray-600 max-w-2xl">
                            Welcome to the admin page! Manage users and customers here.
                        </p>
                    </div>

                    <div>
                        <AdminAccordionTab />
                    </div>
                </div>
            </div>
        </section>
    )
}
