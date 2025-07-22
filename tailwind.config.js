module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",        // Include all files in the `app` directory
        "./components/**/*.{js,jsx,ts,tsx}", // Include all files in the `components` directory
        "./lib/**/*.{js,jsx,ts,tsx}",        // Include utility files if Tailwind classes are used
    ],
    theme: { extend: {} },
    // plugins: [require("daisyui")],
    // daisyui: { themes: ["light", "dark"] },
};