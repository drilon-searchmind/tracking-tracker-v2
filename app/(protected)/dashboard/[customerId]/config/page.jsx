import Image from "next/image";
import ConfigTable from "./components/ConfigTable";
import ConfigForm from "./components/ConfigForm";
import StaticExpenses from "./components/StaticExpenses";
import ConfigCustomerInfo from "./components/ConfigCustomerInfo";
import ConfigCustomerSharings from "./components/ConfigCustomerSharings";
import ConfigCustomerSettings from "./components/ConfigCustomerSettings";
import Subheading from "@/app/components/UI/Utility/Subheading";
import { dbConnect } from "@/lib/dbConnect";
import Customer from "@/models/Customer";
import ConfigRevenueBudget from "@/models/ConfigRevenueBudget";

async function getCustomerName(customerId) {
    try {
        await dbConnect();
        const customer = await Customer.findById(customerId);
        return customer?.name || customerId;
    } catch (error) {
        console.error("Error fetching customer name:", error);
        return customerId;
    }
}

async function getRevenueBudget(customerId) {
    try {
        console.log("Server: Fetching revenue budget for customer ID:", customerId);
        await dbConnect();
        
        const revenueBudget = await ConfigRevenueBudget.findOne({ customer: customerId });
        console.log("Server: Found revenue budget:", revenueBudget ? "Yes" : "No");
        
        if (revenueBudget) {
            console.log("Server: Revenue budget configs count:", revenueBudget.configs?.length || 0);
        }
        
        return revenueBudget ? JSON.parse(JSON.stringify(revenueBudget)) : null;
    } catch (error) {
        console.error("Error fetching revenue budget:", error);
        return null;
    }
}

export default async function ConfigPage({ params }) {
    // Await params for Next.js 15 compatibility
    const { customerId } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
    
    const [customerName, revenueBudget] = await Promise.all([
        getCustomerName(customerId),
        getRevenueBudget(customerId)
    ]);

    return (
        <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden min-h-screen">
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
                    <Subheading headingText={customerName} />
                    <h1 className="mb-3 md:mb-5 pr-0 md:pr-16 text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] xl:text-[44px]">Configuration</h1>
                    <p className="text-[var(--color-green)] max-w-2xl text-sm md:text-base">
                        Manage your business settings, objectives, expenses, and customer configurations for optimized performance tracking.
                    </p>
                </div>

                {/* Objectives Section */}
                <div className="bg-white rounded-lg shadow-sm border border-[var(--color-light-natural)] p-4 md:p-6 mb-6 md:mb-8">
                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                        <div className="flex-1">
                            <h2 className="text-lg md:text-xl font-semibold text-[var(--color-dark-green)] mb-4">Revenue Objectives</h2>
                            <ConfigTable revenueBudget={revenueBudget} customerId={customerId} baseUrl={baseUrl} />
                        </div>
                        
                        <div className="lg:w-80 xl:w-96">
                            <div className="lg:sticky lg:top-6">
                                <ConfigForm customerId={customerId} baseUrl={baseUrl} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Static Expenses Section */}
                <div className="bg-white rounded-lg shadow-sm border border-[var(--color-light-natural)] p-4 md:p-6 mb-6 md:mb-8">
                    <h2 className="text-lg md:text-xl font-semibold text-[var(--color-dark-green)] mb-4">Static Expenses</h2>
                    <p className="text-[var(--color-green)] text-sm mb-6">Configure fixed costs and percentages for accurate P&L calculations.</p>
                    <StaticExpenses customerId={customerId} />
                </div>

                {/* Customer Settings Section */}
                <div className="bg-white rounded-lg shadow-sm border border-[var(--color-light-natural)] p-4 md:p-6">
                    <div className="mb-6">
                        <h2 className="text-lg md:text-xl font-semibold text-[var(--color-dark-green)] mb-2">Customer Settings</h2>
                        <p className="text-[var(--color-green)] text-sm">Manage customer information, preferences, and access permissions.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                        <div className="xl:col-span-1">
                            <div className="bg-[var(--color-natural)] rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-base text-[var(--color-dark-green)] mb-4">Customer Information</h3>
                                <ConfigCustomerInfo customerId={customerId} baseUrl={baseUrl} />
                            </div>
                            
                            <div className="bg-[var(--color-natural)] rounded-lg p-4">
                                <h3 className="font-semibold text-base text-[var(--color-dark-green)] mb-4">Access Management</h3>
                                <ConfigCustomerSharings customerId={customerId} baseUrl={baseUrl} />
                            </div>
                        </div>
                        
                        <div className="xl:col-span-2">
                            <div className="bg-[var(--color-natural)] rounded-lg p-4">
                                <ConfigCustomerSettings customerId={customerId} baseUrl={baseUrl} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}