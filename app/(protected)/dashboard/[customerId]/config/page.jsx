import Image from "next/image";
import { fetchCustomerDetails } from "@/lib/functions/fetchCustomerDetails";
import ConfigForm from "./components/ConfigForm";

export default async function ConfigPage({ params }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const { customerId } = params;
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
                        <h3 className="font-semibold text-lg mb-2 text-zinc-800">DB</h3>
                        <div className="overflow-auto border border-zinc-200 rounded bg-white">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                                    <tr className="text-zinc-600">
                                        <th className="px-4 py-3">
                                            <input type="checkbox" />
                                        </th>
                                        <th className="px-4 py-3 font-medium">Date ↓</th>
                                        <th className="px-4 py-3 font-medium">Revenue</th>
                                        <th className="px-4 py-3 font-medium">Budget</th>
                                    </tr>
                                </thead>
                                <tbody className="text-zinc-700">
                                    {revenueBudget?.configs?.map((row, i) => (
                                        <tr key={i} className="border-b border-zinc-100">
                                            <td className="px-4 py-3">
                                                <input type="checkbox" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="block font-medium">{row.month}</span>
                                                <span className="text-xs text-zinc-400">{row.year}</span>
                                            </td>
                                            <td className="px-4 py-3">{row.revenue}</td>
                                            <td className="px-4 py-3">{row.budget}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <ConfigForm customerId={customerId} baseUrl={baseUrl} />
                    </div>
                </div>
            </div>
        </div>
    );
}