module.exports = {
    darkMode: 'class', // changed from 'false' to 'class'
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./lib/**/*.{js,jsx,ts,tsx}",
    ],
    theme: { extend: {} },
    // plugins: [require("daisyui")],
    // daisyui: { themes: ["light", "dark"] },
};