import Image from "next/image";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";
import ConfigForm from "./components/ConfigForm";
import ConfigTable from "./components/ConfigTable";
import StaticExpenses from "./components/StaticExpenses";
import ConfigCustomerInfo from "./components/ConfigCustomerInfo";
import ConfigCustomerSharings from "./components/ConfigCustomerSharings";

export default async function ConfigPage({ params }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        ? process.env.NEXT_PUBLIC_BASE_URL
        : process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "http://localhost:3000";

    const resolvedParams = await params;
    const customerId = resolvedParams.customerId;
    const { customerName } = await fetchCustomerDetails(customerId);

    const responseRevenueBudget = await fetch(`${baseUrl}/api/config-revenue-budget/${customerId}`);
    const revenueBudget = await responseRevenueBudget.json();

    return (
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
                    <h2 className="text-blue-900 font-semibold text-sm uppercase">{customerName}</h2>
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px]">Config</h1>
                    <p className="text-gray-600 max-w-2xl">
                        Rhoncus morbi et augue nec, in id ullamcorper at sit. Condimentum sit nunc in eros
                        scelerisque sed. Commodo in viv
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h3 className="font-semibold text-lg mb-2 text-zinc-800">Objectives</h3>
                        <ConfigTable revenueBudget={revenueBudget} customerId={customerId} baseUrl={baseUrl} />
                    </div>

                    <div>
                        <ConfigForm customerId={customerId} baseUrl={baseUrl} />
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-2 text-zinc-800">Static Expenses</h3>
                    <StaticExpenses customerId={customerId} baseUrl={baseUrl} />
                </div>

                <div className="mt-8 grid grid-cols-2 gap-8 bg-white flex flex-col lg:flex-row p-6 rounded-lg shadow-md border border-zinc-200">
                    <div className="col-span-2">
                        <h2 className="font-semibold text-2xl mb-2 text-zinc-800">Customer Settings</h2>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-semibold text-lg mb-2 text-zinc-800">Customer Info</h3>
                        <ConfigCustomerInfo customerId={customerId} baseUrl={baseUrl} />
                    </div>

                    <div className="col-span-1">
                        <h3 className="font-semibold text-lg mb-2 text-zinc-800">Customer Sharings</h3>
                        <ConfigCustomerSharings customerId={customerId} baseUrl={baseUrl} />
                    </div>
                </div>

            </div>
        </div>
    );
}