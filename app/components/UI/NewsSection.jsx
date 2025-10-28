"use client"

import React from 'react';
import { FaArrowRight, FaCalendar, FaClock } from "react-icons/fa";

const NewsSection = () => {
    const newsItems = [
        {
            bgColor: "bg-[var(--color-light-green)]",
            category: "Platform Update",
            title: "Enhanced PPC Dashboard with Advanced Search",
            description: "New search functionality and increased campaign limit to 1000 for better campaign management and data visualization.",
            date: "October 4, 2025",
            readTime: "5 min read"
        },
        {
            bgColor: "bg-[var(--color-green)]",
            category: "Feature Release",
            title: "Advanced Analytics with YTD Comparison",
            description: "Compare your performance year-to-date with enhanced charts and metrics for better decision making.",
            date: "September 28, 2025",
            readTime: "3 min read"
        },
        {
            bgColor: "bg-[var(--color-lime)]",
            category: "New Feature",
            title: "Customer Settings & Currency Selection",
            description: "Customize your dashboard preferences and select your preferred currency for reporting and analytics.",
            date: "September 25, 2025",
            readTime: "4 min read"
        }
    ];

    return (
        <section className="py-20 px-4 md:px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-[var(--color-lime)]/10 text-[var(--color-dark-green)] rounded-full text-sm font-medium mb-4">
                        NEWS & UPDATES
                    </span>
                    <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold text-[var(--color-dark-green)] mb-6">
                        Latest News & 
                        <span className="bg-titlebg relative"> Platform Updates</span>
                    </h2>
                    <p className="text-lg text-[var(--color-green)] max-w-3xl mx-auto">
                        Stay updated with the latest features, improvements, and insights from our marketing analytics platform. 
                        Discover new ways to optimize your campaigns and boost performance.
                    </p>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {newsItems.map((item, index) => (
                        <article key={index} className="bg-white rounded-xl shadow-solid-11 hover:shadow-solid-l transition-all duration-300 border border-gray-100 overflow-hidden group">
                            {/* Colored Header */}
                            <div className={`${item.bgColor} h-48 relative overflow-hidden`}>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[var(--color-dark-green)]">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-[var(--color-dark-green)] mb-3 group-hover:text-[var(--color-lime)] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-[var(--color-green)] mb-4 leading-relaxed">
                                    {item.description}
                                </p>
                                
                                <div className="flex items-center justify-between text-sm text-[var(--color-green)]">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <FaCalendar className="mr-2 text-xs" />
                                            {item.date}
                                        </div>
                                        <div className="flex items-center">
                                            <FaClock className="mr-2 text-xs" />
                                            {item.readTime}
                                        </div>
                                    </div>
                                    <button className="flex items-center text-[var(--color-lime)] hover:text-[var(--color-dark-green)] font-medium group">
                                        Read More
                                        <FaArrowRight className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <button className="bg-[var(--color-dark-green)] hover:bg-[var(--color-green)] text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center group">
                        View All Updates
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;