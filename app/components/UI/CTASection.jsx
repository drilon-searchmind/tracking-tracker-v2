"use client"

import React from 'react';
import { FaArrowRight, FaRocket, FaCheckCircle } from "react-icons/fa";

const CTASection = () => {
    const benefits = [
        "Launch your SaaS fast with pre-built integrations",
        "Scale with confidence using enterprise-grade infrastructure", 
        "Get insights with real-time analytics and reporting",
        "Save time with automated data processing and workflows"
    ];

    return (
        <section className="py-20 px-4 md:px-6 bg-gradient-to-br from-[var(--color-primary-searchmind)] to-[var(--color-primary-searchmind-hover)] relative overflow-hidden hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
                <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Content */}
                    <div className="lg:col-span-6 text-white">
                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
                                <FaRocket className="mr-2 text-xs" />
                                LAUNCH YOUR SAAS FAST
                            </span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                            Packed with All Essential
                            <span className="block text-[var(--color-secondary-searchmind)]">Integrations</span>
                        </h2>
                        
                        <p className="text-lg text-white/90 mb-8 leading-relaxed">
                            Get started quickly with our comprehensive marketing analytics platform. 
                            Everything you need for data-driven marketing success, all in one place.
                        </p>

                        {/* Benefits List */}
                        <div className="space-y-4 mb-8">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start">
                                    <FaCheckCircle className="text-[var(--color-secondary-searchmind)] mt-1 mr-3 flex-shrink-0" />
                                    <span className="text-white/90">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-white text-[var(--color-primary-searchmind)] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center group">
                                Get Started
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Mock Analytics Dashboard */}
                    <div className="lg:col-span-6">
                        <div className="relative">
                            {/* Main Dashboard Card */}
                            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Audience Overview</h3>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">New Visitor</span>
                                        <div className="w-3 h-3 bg-green-500 rounded-full ml-4"></div>
                                        <span className="text-sm text-gray-600">Unique Visitor</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-600">+24,558</div>
                                        <div className="text-sm text-gray-600">New Visitors</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">+45,558</div>
                                        <div className="text-sm text-gray-600">Unique Visitors</div>
                                    </div>
                                </div>

                                {/* Mock Chart */}
                                <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-between p-4 relative overflow-hidden">
                                    {/* Chart bars */}
                                    {[60, 80, 40, 90, 70, 85, 65, 95, 75, 88, 92, 78].map((height, index) => (
                                        <div 
                                            key={index} 
                                            className="w-4 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-purple-600" 
                                            style={{height: `${height}%`}}
                                        ></div>
                                    ))}
                                    
                                    {/* Trend line overlay */}
                                    <div className="absolute inset-4">
                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <polyline
                                                fill="none"
                                                stroke="rgba(34, 197, 94, 0.8)"
                                                strokeWidth="2"
                                                points="0,40 10,20 20,60 30,10 40,30 50,15 60,35 70,5 80,25 90,12 100,22"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Bottom metrics */}
                                <div className="mt-4 flex justify-between text-xs text-gray-500">
                                    <span>Jan</span>
                                    <span>Feb</span>
                                    <span>Mar</span>
                                    <span>Apr</span>
                                    <span>May</span>
                                    <span>Jun</span>
                                    <span>Jul</span>
                                </div>
                            </div>

                            {/* Floating notification cards */}
                            <div className="absolute -top-4 -left-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                                📈 Revenue +15%
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                                ✉️ Gmail Integration
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;