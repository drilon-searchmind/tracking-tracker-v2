"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { FaPlay, FaArrowRight, FaChartLine, FaUsers, FaBolt } from "react-icons/fa";

const HeroSection = () => {
    // Animation state for chart bars
    const [chartHeights, setChartHeights] = useState([60, 80, 40, 90, 70, 85, 65, 95, 75, 88, 92, 78]);
    
    // Animation state for counting numbers
    const [revenueCount, setRevenueCount] = useState(0);
    const [conversionsCount, setConversionsCount] = useState(0);

    // Target values for counting
    const targetRevenue = 24.5;
    const targetConversions = 1247;

    // Animate chart bars every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const newHeights = Array.from({ length: 12 }, () => Math.random() * 90 + 10);
            setChartHeights(newHeights);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Animate counting numbers on mount
    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60; // 60 steps for smooth animation
        const stepTime = duration / steps;
        
        let currentStep = 0;
        
        const countInterval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            
            // Easing function for smoother animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            setRevenueCount(targetRevenue * easeOutQuart);
            setConversionsCount(Math.floor(targetConversions * easeOutQuart));
            
            if (currentStep >= steps) {
                clearInterval(countInterval);
                setRevenueCount(targetRevenue);
                setConversionsCount(targetConversions);
            }
        }, stepTime);

        return () => clearInterval(countInterval);
    }, [targetRevenue, targetConversions]);

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <Image
                    width={1920}
                    height={1080}
                    src="/images/shape-dotted-light.svg"
                    alt="bg"
                    className="w-full h-full object-cover opacity-30"
                />
            </div>

            <div className="mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    {/* Left Content */}
                    <div className="lg:col-span-6">
                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
                                <FaBolt className="mr-2 text-xs" />
                                Searchmind Apex
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-black mb-6 leading-tight">
                            Powerful Marketing
                            <span className="bg-titlebg relative"> Analytics </span>
                            Platform
                        </h1>
                        
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Streamline your marketing performance with comprehensive analytics, campaign management, 
                            and data visualization tools. Make data-driven decisions with confidence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button className="bg-[var(--color-primary-searchmind)] hover:bg-[var(--color-primary-searchmind-hover)] text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center group">
                                Get Started
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                                <FaPlay className="mr-2" />
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8">
                            <div>
                                <div className="text-2xl font-bold text-[var(--color-primary-searchmind)]">500+</div>
                                <div className="text-sm text-gray-600">Active Campaigns</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-[var(--color-primary-searchmind)]">98%</div>
                                <div className="text-sm text-gray-600">Data Accuracy</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-[var(--color-primary-searchmind)]">24/7</div>
                                <div className="text-sm text-gray-600">Monitoring</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Dashboard Preview */}
                    <div className="lg:col-span-6 pl-10 pr-20">
                        <div className="relative">
                            <div className="bg-white rounded-2xl shadow-solid-l border border-gray-200 p-6 transform rotate-2">
                                {/* Mock Dashboard */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-800">Campaign Overview</h3>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Mock Chart with Animation */}
                                    <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-end justify-between p-4">
                                        {chartHeights.map((height, index) => (
                                            <div 
                                                key={index}
                                                className="w-4 bg-blue-500 rounded-t transition-all duration-1000 ease-in-out" 
                                                style={{height: `${height}%`}}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Mock Metrics with Animated Numbers */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg border">
                                        <FaChartLine className="text-green-500 mb-2" />
                                        <div className="text-xl font-bold text-gray-800">
                                            ${revenueCount.toFixed(1)}K
                                        </div>
                                        <div className="text-sm text-gray-600">Revenue</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border">
                                        <FaUsers className="text-blue-500 mb-2" />
                                        <div className="text-xl font-bold text-gray-800">
                                            {conversionsCount.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-600">Conversions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;