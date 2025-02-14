export const prerender = true;

import fs from 'fs';
import path from 'path';

export async function GET() {
	const sketchesDir = path.resolve('static/sketches');
	const files = fs.readdirSync(sketchesDir);
	const randomFile = files[Math.floor(Math.random() * files.length)];
	const filePath = path.join(sketchesDir, randomFile);
	const fileContent = fs.readFileSync(filePath, 'utf-8');

	return new Response(fileContent, {
		status: 200,
		headers: {
			'Content-Type': 'application/javascript'
		}
	});
}
