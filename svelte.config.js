import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss: true,
	}),

	kit: {
		adapter: adapter(),
		alias: {
			$css: 'src/css',
			$components: 'src/components',
			$lib: 'src/lib',
			$stores: 'src/stores',
			$types: 'src/types',
		},
	},
};

export default config;
