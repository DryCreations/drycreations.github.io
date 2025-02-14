export const prerender = true;

import fs from 'fs';
import path from 'path';

// Simple hash function for strings
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

export async function GET({ url }) {
    const seed = url.searchParams.get('seed') || 'default';
    const sketchesDir = path.resolve('static/sketches');
    const files = fs.readdirSync(sketchesDir);
    
    // Use the seed to consistently select a random file
    const hash = hashString(seed);
    const randomFile = files[hash % files.length];
    const filePath = path.join(sketchesDir, randomFile);
    const sketchContent = fs.readFileSync(filePath, 'utf-8');

    return new Response(JSON.stringify({
        sketch: sketchContent,
        file: randomFile
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
