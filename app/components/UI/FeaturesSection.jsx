"use client"

import React from 'react';
import Image from "next/image";
import { FaChartBar, FaDatabase, FaCog, FaShieldAlt, FaRocket, FaUsers } from "react-icons/fa";
import { SiGoogleanalytics, SiGoogleads, SiMeta, SiMongodb, SiGooglebigquery } from "react-icons/si";

const FeaturesSection = () => {
    const features = [
        {
            icon: <FaChartBar className="text-3xl text-blue-600" />,
            title: "Advanced Analytics",
            description: "Comprehensive dashboard with real-time metrics, campaign performance tracking, and revenue analysis."
        },
        {
            icon: <SiGooglebigquery className="text-3xl text-green-600" />,
            title: "BigQuery Integration",
            description: "Seamless data processing and analysis with Google BigQuery for scalable marketing insights."
        },
        {
            icon: <FaUsers className="text-3xl text-purple-600" />,
            title: "Campaign Management",
            description: "Plan, execute, and track marketing campaigns with user assignment and collaboration tools."
        },
        {
            icon: <FaDatabase className="text-3xl text-orange-600" />,
            title: "Data Integration",
            description: "Connect multiple data sources including Google Ads, Facebook, and analytics platforms."
        },
        {
            icon: <FaCog className="text-3xl text-gray-600" />,
            title: "Custom Configuration",
            description: "Flexible settings for revenue budgets, static expenses, and customer-specific preferences."
        },
        {
            icon: <FaShieldAlt className="text-3xl text-red-600" />,
            title: "Secure Access",
            description: "Role-based access control with secure authentication and customer data isolation."
        }
    ];

    return (
        <section className="py-6 md:py-20 px-4 md:px-0 relative overflow-hidden">
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

            <div className="max-w-7xl mx-auto px-0 md:px-20 z-10 relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                        CORE FEATURES
                    </span>
                    <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold text-black mb-6">
                        Everything You Need for 
                        <span className="bg-titlebg relative"> Marketing Success</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Our platform combines powerful analytics, seamless integrations, and intuitive campaign management 
                        to help you optimize your marketing performance and drive better results.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white rounded-xl p-8 shadow-solid-11 hover:shadow-solid-l transition-shadow duration-300 border border-gray-100">
                            <div className="mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-black mb-4">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Integration Showcase */}
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-solid-l border border-gray-200">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
                            Powerful Integrations
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Connect your favorite marketing tools and data sources for a unified view of your performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                        <div className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <SiGoogleads className="text-4xl text-blue-600 mb-2" />
                            <span className="text-sm font-medium text-gray-700">Google Ads</span>
                        </div>
                        <div className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <SiGoogleanalytics className="text-4xl text-orange-500 mb-2" />
                            <span className="text-sm font-medium text-gray-700">Analytics</span>
                        </div>
                        <div className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <SiMeta className="text-4xl text-blue-700 mb-2" />
                            <span className="text-sm font-medium text-gray-700">Meta Ads</span>
                        </div>
                        <div className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <SiMongodb className="text-4xl text-green-500 mb-2" />
                            <span className="text-sm font-medium text-gray-700">MongoDB</span>
                        </div>
                        <div className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <SiGooglebigquery className="text-4xl text-blue-500 mb-2" />
                            <span className="text-sm font-medium text-gray-700">BigQuery</span>
                        </div>
                        <div className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <FaRocket className="text-4xl text-purple-600 mb-2" />
                            <span className="text-sm font-medium text-gray-700">More</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;