"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    theme: "light",
    toggleTheme: () => { },
});

export function ThemeProvider({ children }) {
    const [theme] = useState("light");

    // useEffect(() => {
    //     const savedTheme = localStorage.getItem("theme");
    //     if (savedTheme) {
    //         setTheme(savedTheme);
    //         if (savedTheme === "dark") {
    //             document.documentElement.classList.add("dark");
    //         }
    //     } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    //         setTheme("dark");
    //         document.documentElement.classList.add("dark");
    //     }
    // }, []);

    const toggleTheme = () => {
        return;
        
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);