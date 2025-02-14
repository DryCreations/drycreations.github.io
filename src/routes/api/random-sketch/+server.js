import fs from 'fs';
import path from 'path';

export async function GET() {
	const sketchesDir = path.resolve('static/sketches');
	const files = fs.readdirSync(sketchesDir);
	const randomFile = files[Math.floor(Math.random() * files.length)];
	const filePath = path.join(sketchesDir, randomFile);
	const fileContent = fs.readFileSync(filePath, 'utf-8');

	// Write the random sketch to a static file during the build process
	if (process.env.NODE_ENV === 'production') {
		const outputDir = path.resolve('static/api');
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}
		fs.writeFileSync(path.join(outputDir, 'random-sketch.js'), fileContent);
	}

	return new Response(fileContent, {
		status: 200,
		headers: {
			'Content-Type': 'application/javascript'
		}
	});
}
