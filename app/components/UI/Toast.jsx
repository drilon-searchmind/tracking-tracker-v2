"use client"

import { useEffect, useState } from "react";
import { IoMdCheckmarkCircle, IoMdClose, IoMdWarning } from "react-icons/io";

export default function Toast({
    message,
    type = "success",
    duration = 4000,
    onClose,
}) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const colors = {
        success: "bg-green-50 border-green-500 text-green-800",
        error: "bg-red-50 border-red-500 text-red-800",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
        info: "bg-blue-50 border-blue-500 text-blue-800"
    };

    const icons = {
        success: <IoMdCheckmarkCircle className="text-green-500 text-xl" />,
        error: <IoMdWarning className="text-red-500 text-xl" />,
        warning: <IoMdWarning className="text-yellow-500 text-xl" />,
        info: <IoMdWarning className="text-blue-500 text-xl" />
    };

    return (
        <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center p-4 mb-4 border-l-4 rounded-lg shadow-md transition-all duration-300 ${colors[type]} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        >
            <div className="inline-flex items-center justify-center flex-shrink-0 mr-3">
                {icons[type]}
            </div>
            <div className="ml-3 text-sm font-medium">{message}</div>
            <button
                onClick={() => {
                    setIsVisible(false);
                    if (onClose) setTimeout(onClose, 300);
                }}
                className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-gray-100"
            >
                <IoMdClose className="text-gray-500" />
            </button>
        </div>
    );
}