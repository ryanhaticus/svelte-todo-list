const { orange } = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				indigo: orange,
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
