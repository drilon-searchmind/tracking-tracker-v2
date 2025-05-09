/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx}",        // scans your App‑Router files
        "./components/**/*.{js,jsx}", // scans your shared components
    ],
    theme: { extend: {} },
    plugins: [require("daisyui")],
    daisyui: { themes: ["light", "dark"] },
};
