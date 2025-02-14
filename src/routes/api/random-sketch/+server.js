export const prerender = true;

import fs from 'fs';
import path from 'path';

// Generate 10 different static versions
export async function entries() {
    return Array.from({ length: 10 }, (_, i) => ({
        id: i.toString()
    }));
}

export async function GET({ params }) {
    const sketchesDir = path.resolve('static/sketches');
    const files = fs.readdirSync(sketchesDir);
    
    // Use the entry ID to deterministically select a sketch
    const index = parseInt(params.id || '0') % files.length;
    const selectedFile = files[index];
    const filePath = path.join(sketchesDir, selectedFile);
    const sketchContent = fs.readFileSync(filePath, 'utf-8');

    return new Response(JSON.stringify({
        sketch: sketchContent,
        file: selectedFile
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
