"use client"

import Image from "next/image";
import ProfileAccordionTab from "./my-profile-components/ProfileAccordionTab";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Subheading from "@/app/components/UI/Utility/Subheading";

export default function MyProfile() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'settings';

    return (
        <section id="pageMyProfile" className="">
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
                        <Subheading headingText="My Profile" />
                        <h1 className="mb-3 md:mb-5 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px]">Profile Overview</h1>
                        <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                            {session?.user?.name
                                ? `Welcome, ${session.user.name}! Manage your profile settings, view your campaigns, and configure integrations.`
                                : 'Welcome to your profile page! Manage your profile settings, view your campaigns, and configure integrations.'}
                        </p>
                    </div>

                    <div>
                        <ProfileAccordionTab defaultActiveTab={activeTab} />
                    </div>
                </div>
            </div>
        </section>
    )
}