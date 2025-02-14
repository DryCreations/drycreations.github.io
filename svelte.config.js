import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { buildSketches } from './src/lib/build-sketches.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: true,
			onStart: () => {
				buildSketches();
			}
		}),
		paths: {
			base: process.env.NODE_ENV === 'development' ? '' : process.env.BASE_PATH || ''
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				if (message.includes('does not begin with `base`')) {
					return;
				}
				throw new Error(message);
			},
			entries: ['*'],  // Simplified to prerender everything
			handleMissingId: 'ignore'
		}
	},
	preprocess: [
		mdsvex({
			extension: '.md',
			layout: {
				_: 'src/routes/blog/_post.svelte'
			}
		})
	]
};

export default config;
