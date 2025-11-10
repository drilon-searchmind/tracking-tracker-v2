"use client";

import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { PiCaretDownThin } from "react-icons/pi";
import { CiShare2, CiUser } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import ShareCustomerModal from "@/app/components/Dashboard/ShareCustomerModal";
import { useState, useEffect } from "react";
import { useModalContext } from "@/app/contexts/CampaignModalContext";

export default function RollUpLayout({ children }) {
    const segments = useSelectedLayoutSegments();
    const parentCustomerId = segments[0] || null;
    const [showModalShare, setShowModalShare] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { isAnyModalOpen } = useModalContext();
    const [parentCustomerName, setParentCustomerName] = useState("");

    const isActive = (path) => {
        const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
        const cleanPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
        return cleanPathname === cleanPath;
    };

    const isServiceActive = pathname.startsWith(`/roll-up/${parentCustomerId}/service-dashboard`);
    const isToolsActive = pathname.startsWith(`/roll-up/${parentCustomerId}/tools`);
    const isConfigActive = pathname.startsWith(`/roll-up/${parentCustomerId}/config`);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (parentCustomerId) {
            const fetchParentCustomerName = async () => {
                try {
                    const response = await fetch(`/api/parent-customers`);
                    if (response.ok) {
                        const parentCustomers = await response.json();
                        const parentCustomer = parentCustomers.find(pc => pc._id === parentCustomerId);
                        setParentCustomerName(parentCustomer?.name || "Parent Customer");
                    } else {
                        console.error("Failed to fetch parent customer details");
                        setParentCustomerName("Parent Customer");
                    }
                } catch (error) {
                    console.error("Error fetching parent customer details:", error);
                    setParentCustomerName("Parent Customer");
                }
            };

            fetchParentCustomerName();
        }
    }, [parentCustomerId]);

    return (
        <section id="RollUpLayout" className="relative">
            {children}
        </section>
    );
}