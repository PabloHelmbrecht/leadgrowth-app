import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"


const config = {
	darkMode: ["class", "media"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		},
    		fontFamily: {
    			sans: [
    				'var(--font-inter)'
    			],
    			mono: [
    				'var(--font-inter-mono)'
    			]
    		},
    		colors: {
    			danger: colors.red,
    			warning: colors.amber,
    			success: colors.emerald,
    			primary: {
    				'100': '#e5f1ff',
    				'200': '#b4d7ff',
    				'300': '#83bcff',
    				'400': '#51a2ff',
    				'500': '#1f87ff',
    				'600': '#186dcf',
    				'700': '#10529e',
    				'800': '#003282',
    				'900': '#001d3d'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config