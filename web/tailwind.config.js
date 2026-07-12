// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "1rem",
                md: "1.5rem",
                lg: "2rem",
                xl: "2rem",
                "2xl": "2rem",
            },
            screens: {
                "2xl": "1440px",
            },
        },

        extend: {
            colors: {
                // Brand
                primary: {
                    DEFAULT: "#10B981",
                    dark: "#006C49",
                    light: "#6FFBBE",
                    foreground: "#FFFFFF",
                    container: "#10B981",
                    "container-foreground": "#00422B",
                },

                secondary: {
                    DEFAULT: "#2563EB",
                    dark: "#0051D5",
                    foreground: "#FFFFFF",
                    container: "#316BF3",
                    "container-foreground": "#FEFCFF",
                },

                tertiary: {
                    DEFAULT: "#A43A3A",
                    foreground: "#FFFFFF",
                    container: "#FC7C78",
                },

                background: "#F9F9FF",

                surface: {
                    DEFAULT: "#FFFFFF",
                    alt: "#F8FAFC",
                    dim: "#D3DAEF",
                    bright: "#F9F9FF",

                    lowest: "#FFFFFF",
                    low: "#F1F3FF",
                    container: "#E9EDFF",
                    high: "#E1E8FD",
                    highest: "#DCE2F7",

                    variant: "#DCE2F7",
                },

                text: {
                    DEFAULT: "#141B2B",
                    muted: "#3C4A42",
                    inverse: "#EDF0FF",
                },

                border: {
                    DEFAULT: "#E2E8F0",
                    subtle: "#E2E8F0",
                    outline: "#6C7A71",
                    variant: "#BBCABF",
                },

                success: "#10B981",

                info: "#2563EB",

                error: {
                    DEFAULT: "#BA1A1A",
                    container: "#FFDAD6",
                },

                emerald: {
                    subtle: "#ECFDF5",
                },

                blue: {
                    subtle: "#EFF6FF",
                },
            },

            fontFamily: {
                sans: [
                    "Inter",
                    "system-ui",
                    "sans-serif",
                ],
                mono: [
                    "Inter",
                    "monospace",
                ],
            },

            fontSize: {
                display: [
                    "48px",
                    {
                        lineHeight: "56px",
                        letterSpacing: "-0.02em",
                        fontWeight: "700",
                    },
                ],

                "headline-lg": [
                    "32px",
                    {
                        lineHeight: "40px",
                        letterSpacing: "-0.02em",
                        fontWeight: "600",
                    },
                ],

                "headline-md": [
                    "24px",
                    {
                        lineHeight: "32px",
                        fontWeight: "600",
                    },
                ],

                "headline-sm": [
                    "20px",
                    {
                        lineHeight: "28px",
                        fontWeight: "600",
                    },
                ],

                "body-lg": [
                    "18px",
                    {
                        lineHeight: "28px",
                    },
                ],

                "body-md": [
                    "16px",
                    {
                        lineHeight: "24px",
                    },
                ],

                "body-sm": [
                    "14px",
                    {
                        lineHeight: "20px",
                    },
                ],

                "label-md": [
                    "14px",
                    {
                        lineHeight: "20px",
                        fontWeight: "500",
                    },
                ],

                "label-sm": [
                    "12px",
                    {
                        lineHeight: "16px",
                        letterSpacing: "0.01em",
                        fontWeight: "500",
                    },
                ],

                mono: [
                    "13px",
                    {
                        lineHeight: "18px",
                    },
                ],
            },

            borderRadius: {
                sm: "0.25rem",
                DEFAULT: "0.5rem",
                md: "0.75rem",
                lg: "1rem",
                xl: "1.5rem",
            },

            spacing: {
                18: "4.5rem",
                22: "5.5rem",
                26: "6.5rem",
                30: "7.5rem",
            },

            boxShadow: {
                card: "0 1px 2px rgba(15,23,42,.05)",

                hover: "0 8px 20px rgba(15,23,42,.08)",

                floating:
                    "0 10px 15px -3px rgba(0,0,0,.05)",

                glow:
                    "0 0 0 3px rgba(16,185,129,.10)",
            },

            backdropBlur: {
                glass: "12px",
            },

            backgroundImage: {
                "primary-gradient":
                    "linear-gradient(180deg,#10B981,#0FAF7A)",

                "hero-gradient":
                    "linear-gradient(135deg,#EFF6FF 0%,#ECFDF5 100%)",
            },

            transitionTimingFunction: {
                smooth: "cubic-bezier(.4,0,.2,1)",
            },

            transitionDuration: {
                250: "250ms",
            },
        },
    },

    plugins: [],
};