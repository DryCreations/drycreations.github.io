export const prerender = true;

import fs from 'fs';
import path from 'path';

export async function GET() {
    // Use the static/sketches folder because buildSketches copies files there
    const sketchesFolder = path.join(process.cwd(), 'static', 'sketches');
    if (!fs.existsSync(sketchesFolder)) {
        return new Response(JSON.stringify({ sketches: [] }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const files = fs.readdirSync(sketchesFolder).filter(f => f.endsWith('.js'));
    const sketches = files.map(file => `/sketches/${file}`);
    return new Response(JSON.stringify({ sketches }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
