"use client"

import React, { useState } from 'react';
import { FaPlus, FaMinus, FaArrowRight } from "react-icons/fa";

const FAQSection = () => {
    const [openFAQ, setOpenFAQ] = useState(0);

    const faqs = [
        {
            question: "How does the marketing analytics platform work?",
            answer: "Our platform integrates with your existing marketing tools like Google Ads, Facebook Ads, and Google Analytics to provide comprehensive performance tracking. We collect data from multiple sources, process it through BigQuery, and present it in easy-to-understand dashboards and reports."
        },
        {
            question: "What integrations are supported?",
            answer: "We support a wide range of integrations including Google Ads, Google Analytics, Facebook Ads, Google BigQuery, MongoDB, and many more. Our platform is designed to work with the most popular marketing and analytics tools to give you a complete view of your performance."
        },
        {
            question: "Can I manage multiple campaigns and users?",
            answer: "Yes! Our platform supports multi-user collaboration with role-based access control. You can assign users to specific campaigns, manage permissions, and track performance across multiple campaigns simultaneously. The system supports up to 1000+ campaigns with advanced filtering and search capabilities."
        },
        {
            question: "Is my data secure and private?",
            answer: "Absolutely. We implement enterprise-grade security measures including encrypted data transmission, secure authentication, role-based access control, and customer data isolation. Your data is stored securely and only accessible to authorized users within your organization."
        },
        {
            question: "How accurate is the data and reporting?",
            answer: "Our platform maintains 98% data accuracy through direct API connections with your marketing platforms. We process data in real-time and provide 24/7 monitoring to ensure data integrity. All metrics are validated and cross-referenced across multiple sources."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? -1 : index);
    };

    return (
        <section className="py-20 px-4 md:px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Content */}
                    <div className="lg:col-span-5">
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                            OUR FAQS
                        </span>
                        <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold text-black mb-6">
                            Frequently Asked
                            <span className="bg-titlebg relative"> Questions</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            We provide digital experience services to startups and small businesses. 
                            We help our clients succeed by creating brand identities, digital experiences, 
                            and comprehensive marketing strategies.
                        </p>
                        <button className="bg-[var(--color-primary-searchmind)] hover:bg-[var(--color-primary-searchmind-hover)] text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center group">
                            Know More
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Right Content - FAQ List */}
                    <div className="lg:col-span-7">
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-solid-11">
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors rounded-xl"
                                    >
                                        <h3 className="text-lg font-semibold text-black pr-4">
                                            {faq.question}
                                        </h3>
                                        <div className="flex-shrink-0">
                                            {openFAQ === index ? (
                                                <FaMinus className="text-gray-400" />
                                            ) : (
                                                <FaPlus className="text-gray-400" />
                                            )}
                                        </div>
                                    </button>
                                    
                                    {openFAQ === index && (
                                        <div className="px-6 pb-6">
                                            <div className="border-t border-gray-100 pt-4">
                                                <p className="text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;