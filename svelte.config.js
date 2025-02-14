import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.env.NODE_ENV === 'development' ? '' : process.env.BASE_PATH || ''
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404 errors during prerendering
				if (message.includes('does not begin with `base`')) {
					return;
				}
				throw new Error(message);
			}
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
