"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/home";

    // Simple redirect for authenticated users - no conditional rendering
    useEffect(() => {
        if (status === "authenticated" && session) {
            // Use window.location instead of router to bypass client-side routing issues
            window.location.href = "/home";
        }
    }, [status, session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Use callbackUrl to specify where to redirect after login
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
                callbackUrl: "/home"
            });

            if (result?.error) {
                setError(result.error);
            } else if (result?.ok) {
                // Use window.location instead of router for more reliable redirect
                window.location.href = "/home";
            }
        } catch (error) {
            setError("An error occurred during login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Important: No conditional rendering for authentication state - just show the form
    return (
        <div className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-t from-white to-[#f8fafc] rounded-lg z-1"></div>
            <div className="absolute bottom-[-355px] left-0 w-full h-full z-1 pointer-events-none">
                <Image
                    width={1920}
                    height={1080}
                    src="/images/shape-dotted-light.svg"
                    alt="bg"
                    className="w-full h-full"
                />
            </div>

            <div className="max-w-md mx-auto z-10 relative">
                <div className="mb-8 text-center">
                    <h4 className="mb-4 text-base md:text-lg font-light text-zinc-700">Searchmind Apex</h4>
                    <h1 className="mb-5 text-2xl md:text-3xl xl:text-[44px] font-bold text-black">
                        Welcome Back
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">
                        Sign in to your account to access your dashboard
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-solid-l p-8 border border-zinc-200 z-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-searchmind)] focus:border-[var(--color-primary-searchmind)]"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-searchmind)] focus:border-[var(--color-primary-searchmind)]"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--color-primary-searchmind)] py-3 px-8 rounded text-white hover:bg-opacity-90 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-searchmind)]"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}