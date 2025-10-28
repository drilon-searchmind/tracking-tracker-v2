import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';
import Subheading from '../components/UI/Utility/Subheading';

const UnauthorizedAccess = ({ message = "You do not have permission to access this page." }) => {
    return (
        <div className="container mx-auto py-6 md:py-20 px-4 md:px-0 relative overflow-hidden">
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

            <div className="px-0 md:px-20 mx-auto z-10 relative">
                <div className="mb-6 md:mb-8">
                    <Subheading headingText="Searchmind Apex" />
                    <h1 className="mb-3 md:mb-5 text-2xl md:text-3xl font-bold text-black xl:text-[44px]">Access Restricted</h1>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-solid-l border border-zinc-200 mb-6 md:mb-10 max-w-2xl">
                    <div className="flex items-start space-x-4">
                        <div className="text-red-500 flex-shrink-0">
                            <FaExclamationTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-zinc-900 mb-2">Unauthorized Access</h3>
                            <p className="text-gray-600 mb-4">{message}</p>
                            <p className="text-gray-500 text-sm">
                                If you believe this is an error, please contact the system administrator.
                            </p>
                        </div>
                    </div>
                </div>

                <Link 
                    href="/home" 
                    className="inline-flex items-center justify-center py-2 px-4 rounded text-white bg-zinc-700 hover:bg-zinc-800 gap-2 text-sm"
                >
                    Return to Home Page
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedAccess;