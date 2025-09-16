"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function UserSettingsContent() {
    const { data: session } = useSession();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
    });

    useEffect(() => {
        if (session?.user) {
            setUserData({
                name: session.user.name || '',
                email: session.user.email || '',
            });
        }
    }, [session]);

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold mb-6">User Settings</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                            <tr className="text-zinc-600">
                                <th className="px-4 py-3 font-medium">Setting</th>
                                <th className="px-4 py-3 font-medium">Value</th>
                            </tr>
                        </thead>
                        <tbody className="text-zinc-700 divide-y divide-zinc-100">
                            <tr>
                                <td className="px-4 py-3 font-medium">Name</td>
                                <td className="px-4 py-3">{userData.name}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium">Email</td>
                                <td className="px-4 py-3">{userData.email}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium">Password</td>
                                <td className="px-4 py-3">••••••••</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='mt-10'>
                <h2 className="text-2xl font-semibold mb-6">Shared Properties</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                            <tr className="text-zinc-600">
                                <th className="px-4 py-3 font-medium">Property Name</th>
                                <th className="px-4 py-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="text-zinc-700 divide-y divide-zinc-100">
                            <tr>
                                <td className="px-4 py-3 font-medium">Name</td>
                                <td className="px-4 py-3">View</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}