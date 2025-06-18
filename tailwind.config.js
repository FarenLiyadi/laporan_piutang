import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
export default withMT({
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        container: {
            center: true,
            padding: "1rem",
            screens: {
                xl: "1200px",
            },
        },
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                cormorant: ["Cormorant", "serif"],
                gardenia: ["Gardenia Summer", "serif"],
                meath: ["MeathFLF", "serif"],
                ballet: ["Ballet", "script"],
                kulim: ['"Kulim Park"', "serif"],
                barlow: ["Barlow Condensed", "sans-serif"],
                roboto: ["Roboto", "sans-serif"],
                arial: ["Arial", "sans-serif"],
                robotoslab: ["Roboto Slab", "serif"],
                playfair: ["Playfair Display", "serif"],
                arima: ["Arima", "serif"],
                abeezee: ["abeezee", "serif"],
                gabriola: ["Gabriola", "serif"],
                maigre: ["Maigre", "serif"],
                vintage: ["VintageHeirloom", "serif"],
                allora: ["Allora", "serif"],
                allura: ["Allura", "serif"],
            },
            colors: {
                gold: "#e49f28",
                card: "#212121",
            },
            Keyframe: {
                "fade-in-down": {
                    "0%": {
                        opacity: 0,
                        transform: "translate3d(0, -100%, 0)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translate3d(0, 0, 0)",
                    },
                },
            },
        },
    },

    plugins: [
        forms,
        function ({ addUtilities }) {
            const newUtilities = {
                ".no-scrollbar::-webkit-scrollbar": {
                    display: "none",
                },
                ".no-scrollbar": {
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                },
            };
            addUtilities(newUtilities);
        },
    ],
});
