"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { FaPlay, FaArrowRight, FaChartLine, FaUsers, FaBolt } from "react-icons/fa";

const HeroSection = () => {
    const [chartHeights, setChartHeights] = useState([60, 80, 40, 90, 70, 85, 65, 95, 75, 88, 92, 78]);
    
    const [currentRevenue, setCurrentRevenue] = useState(24.5);
    const [currentConversions, setCurrentConversions] = useState(1247);
    const [targetRevenue, setTargetRevenue] = useState(24.5);
    const [targetConversions, setTargetConversions] = useState(1247);

    const generateRandomValues = () => {
        const newRevenue = Math.random() * 90 + 10; 
        const newConversions = Math.floor(Math.random() * 1900 + 100);
        return { newRevenue, newConversions };
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const newHeights = Array.from({ length: 12 }, () => Math.random() * 90 + 10);
            setChartHeights(newHeights);
            
            // Generate new target values for metrics
            const { newRevenue, newConversions } = generateRandomValues();
            setTargetRevenue(newRevenue);
            setTargetConversions(newConversions);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const duration = 1000; 
        const steps = 30;
        const stepTime = duration / steps;
        
        let currentStep = 0;
        const startRevenue = currentRevenue;
        const startConversions = currentConversions;
        
        const animateInterval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            
            const easeInOutQuad = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            const newRevenue = startRevenue + (targetRevenue - startRevenue) * easeInOutQuad;
            const newConversions = startConversions + (targetConversions - startConversions) * easeInOutQuad;
            
            setCurrentRevenue(newRevenue);
            setCurrentConversions(newConversions);
            
            if (currentStep >= steps) {
                clearInterval(animateInterval);
                setCurrentRevenue(targetRevenue);
                setCurrentConversions(targetConversions);
            }
        }, stepTime);

        return () => clearInterval(animateInterval);
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
                            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-lime)]/10 text-[var(--color-dark-green)] text-sm font-medium border border-[var(--color-lime)]">
                                <FaBolt className="mr-2 text-xs" />
                                Searchmind Apex Platform
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-[var(--color-dark-green)] mb-6 leading-tight">
                            Powerful Marketing
                            <span className="bg-titlebg relative"> Analytics </span>
                            Platform
                        </h1>
                        
                        <p className="text-lg text-[var(--color-green)] mb-8 leading-relaxed">
                            Streamline your marketing performance with comprehensive analytics, campaign management, 
                            and data visualization tools. Make data-driven decisions with confidence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button className="bg-[var(--color-dark-green)] hover:bg-[var(--color-green)] text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center group">
                                Get Started
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="border-2 border-[var(--color-dark-green)] hover:border-[var(--color-green)] text-[var(--color-dark-green)] hover:text-[var(--color-green)] px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                                <FaPlay className="mr-2" />
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8">
                            <div>
                                <div className="text-2xl font-bold text-[var(--color-dark-green)]">500+</div>
                                <div className="text-sm text-[var(--color-green)]">Active Campaigns</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-[var(--color-dark-green)]">98%</div>
                                <div className="text-sm text-[var(--color-green)]">Data Accuracy</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-[var(--color-dark-green)]">24/7</div>
                                <div className="text-sm text-[var(--color-green)]">Monitoring</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Dashboard Preview */}
                    <div className="lg:col-span-6 pr-20 pl-5">
                        <div className="relative">
                            <div className="bg-white rounded-2xl shadow-solid-l border border-gray-200 p-6 transform rotate-2">
                                {/* Mock Dashboard */}
                                <div className="bg-[var(--color-natural)] rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-[var(--color-dark-green)]">Campaign Overview</h3>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-[var(--color-lime)] rounded-full"></div>
                                            <div className="w-3 h-3 bg-[var(--color-light-green)] rounded-full"></div>
                                            <div className="w-3 h-3 bg-[var(--color-green)] rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Mock Chart with Animation */}
                                    <div className="h-32 bg-[var(--color-light-natural)] rounded-lg flex items-end justify-between p-4">
                                        {chartHeights.map((height, index) => (
                                            <div 
                                                key={index}
                                                className="w-4 bg-[var(--color-lime)] rounded-t transition-all duration-1000 ease-in-out" 
                                                style={{height: `${height}%`}}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Mock Metrics with Animated Numbers */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg border">
                                        <FaChartLine className="text-[var(--color-light-green)] mb-2" />
                                        <div className="text-xl font-bold text-[var(--color-dark-green)]">
                                            {currentRevenue.toFixed(1)}K DKK
                                        </div>
                                        <div className="text-sm text-[var(--color-green)]">Revenue</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border">
                                        <FaUsers className="text-[var(--color-light-green)] mb-2" />
                                        <div className="text-xl font-bold text-[var(--color-dark-green)]">
                                            {Math.floor(currentConversions).toLocaleString()}
                                        </div>
                                        <div className="text-sm text-[var(--color-green)]">Conversions</div>
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