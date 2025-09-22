"use client";

export default function Unauthorized() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                <p className="text-gray-600 mb-6">
                    You don't have permission to access this customer's data.
                </p>
                <a
                    href="/dashboard"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Return to Dashboard
                </a>
            </div>
        </div>
    );
}